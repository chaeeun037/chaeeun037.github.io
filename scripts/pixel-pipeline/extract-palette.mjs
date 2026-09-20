// 팔레트 역추출 — 테마 문서 §4.1 "확정 팔레트는 첫 시안 배치에서 역추출해 정한다"의 실행 도구.
//
// 6장 전체에서 뽑는다(1장 앵커 아님). 6장이 한 세트로 쓰이므로 1장 기준 팔레트로
// 나머지를 양자화하면 그 1장에 없던 색이 가장 가까운 남의 색으로 끌려가 뭉개진다.
// 비교용으로 앵커 1장(구름) 기준 팔레트도 같이 뽑아 차이를 눈으로 보게 한다.
//
// 사용: node scripts/pixel-pipeline/extract-palette.mjs [--colors 32]
// 출력: scripts/pixel-pipeline/palette-report.json + 콘솔 요약 + swatch.html

import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { histogram, medianCut, dedupe, deltaE, hexToRgb } from './lib/quantize.mjs'
import { detectBackground, keyBackground, labelComponents, isWatermark } from './lib/keying.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const RAW = join(ROOT, 'assets-raw')
const ANCHOR = 'clouds-set-of-3.png' // #28이 "구름=스타일 앵커"로 지정

// 테마 문서 §4.1 v0 제안 — 확정이 아니라 대조군이다. 실물이 얼마나 벌어졌는지 보려고 싣는다.
const V0 = [
  { role: '표층수', hex: '#4ECDC4' },
  { role: '중층수', hex: '#1A6B8A' },
  { role: '심해', hex: '#0D2B45' },
  { role: '캠프파이어', hex: '#FFB347' },
  { role: '모래/트레일', hex: '#E8D5B7' },
]

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const TARGET = Number(arg('colors', 32))

// 배경을 먼저 걷어낸다 — 원본은 배경이 79~91%라 그대로 세면 팔레트가 남색으로 뒤덮인다.
// 워터마크도 뺀다. 남는 건 "피사체 색"뿐이고, 그게 팔레트로 뽑아야 할 대상이다.
async function readSubjectRgba(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const bg = detectBackground(data, w, h)
  const { rgba, backgroundRatio } = keyBackground(data, w, h, bg, { tolerance: 10 })

  const comps = labelComponents(rgba, w, h, { minPixels: 40 })
  const largest = comps[0]?.pixels ?? 0
  let watermarkPx = 0
  for (const c of comps) {
    if (!isWatermark(c, w, h, largest)) continue
    watermarkPx += c.pixels
    for (let y = c.top; y < c.top + c.height; y++) {
      for (let x = c.left; x < c.left + c.width; x++) rgba[(y * w + x) * 4 + 3] = 0
    }
  }
  return { data: rgba, info, bg, backgroundRatio, watermarkPx }
}

const pct = (n, total) => ((n / total) * 100).toFixed(1)

async function main() {
  const files = (await readdir(RAW)).filter((f) => f.toLowerCase().endsWith('.png')).sort()
  if (files.length === 0) throw new Error(`원본이 없다: ${RAW}`)

  const combined = new Map()
  const perImage = []

  for (const f of files) {
    const { data, info, bg, backgroundRatio, watermarkPx } = await readSubjectRgba(join(RAW, f))
    const hist = histogram(data)
    const totalPx = [...hist.values()].reduce((s, n) => s + n, 0)

    for (const [k, n] of hist) combined.set(k, (combined.get(k) ?? 0) + n)

    perImage.push({
      file: f,
      size: `${info.width}×${info.height}`,
      background: { hex: '#' + bg.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(), ratio: pct(backgroundRatio * info.width * info.height, info.width * info.height) },
      watermarkPx,
      uniqueColors: hist.size,
      opaquePx: totalPx,
      dominant: medianCut(hist, 8).map((c) => ({ ...c, share: pct(c.weight, totalPx) })),
      hist,
    })
  }

  const combinedTotal = [...combined.values()].reduce((s, n) => s + n, 0)
  const paletteAll = dedupe(medianCut(combined, TARGET)).map((c) => ({
    ...c,
    share: pct(c.weight, combinedTotal),
  }))

  const anchorEntry = perImage.find((p) => p.file === ANCHOR)
  const paletteAnchor = anchorEntry
    ? dedupe(medianCut(anchorEntry.hist, TARGET)).map((c) => ({
        ...c,
        share: pct(c.weight, anchorEntry.opaquePx),
      }))
    : []

  // v0 제안색이 추출 팔레트에서 얼마나 떨어져 있나 — 확정 판단의 근거
  const nearest = (hex, palette) => {
    const rgb = hexToRgb(hex)
    let best = null
    for (const c of palette) {
      const d = deltaE(rgb, c.rgb)
      if (!best || d < best.d) best = { d, hex: c.hex }
    }
    return best
  }
  const v0Compare = V0.map((v) => {
    const a = nearest(v.hex, paletteAll)
    const b = nearest(v.hex, paletteAnchor)
    return {
      ...v,
      all: a ? { hex: a.hex, deltaE: +a.d.toFixed(1) } : null,
      anchor: b ? { hex: b.hex, deltaE: +b.d.toFixed(1) } : null,
    }
  })

  // 두 후보가 서로 얼마나 다른가 — 앵커 1장으로 갈 때 잃는 색의 양
  const coverageLoss = paletteAll
    .map((c) => ({ ...c, gap: nearest(c.hex, paletteAnchor)?.d ?? Infinity }))
    .filter((c) => c.gap > 12) // ΔE>12 = 눈에 띄게 다른 색
    .sort((a, b) => b.gap - a.gap)

  const report = {
    generatedFor: '#28 THEME-2 · 테마 문서 §4.1 팔레트 확정',
    targetColors: TARGET,
    images: perImage.map((p) => {
      const copy = { ...p }
      delete copy.hist // 리포트에 히스토그램 원본까지 싣지 않는다(수 MB)
      return copy
    }),
    candidates: {
      all: { label: `6장 통합 ${TARGET}색`, colors: paletteAll },
      anchor: { label: `앵커 1장(${ANCHOR}) ${TARGET}색`, colors: paletteAnchor },
    },
    v0Compare,
    coverageLoss: coverageLoss.map((c) => ({ hex: c.hex, share: c.share, deltaE: +c.gap.toFixed(1) })),
  }

  await writeFile(join(HERE, 'palette-report.json'), JSON.stringify(report, null, 2) + '\n')
  await writeFile(join(HERE, 'palette-swatch.html'), renderSwatch(report), 'utf8')

  // ── 콘솔 요약 ──
  console.log(`\n원본 ${files.length}장 · 목표 ${TARGET}색\n`)
  for (const img of perImage) {
    console.log(`  ${basename(img.file).padEnd(30)} 배경 ${img.background.hex} ${String(img.background.ratio).padStart(5)}%  피사체 고유색 ${String(img.uniqueColors).padStart(6)}`)
    console.log(`    ${img.dominant.slice(0, 5).map((c) => `${c.hex}(${c.share}%)`).join(' ')}`)
  }
  console.log(`\n후보 A — 6장 통합 ${TARGET}색`)
  console.log('  ' + paletteAll.map((c) => c.hex).join(' '))
  console.log(`\n후보 B — 앵커 1장 ${TARGET}색`)
  console.log('  ' + paletteAnchor.map((c) => c.hex).join(' '))
  console.log('\nv0 제안색 대비 (ΔE — 0에 가까울수록 제안대로 나왔다는 뜻)')
  for (const v of v0Compare) {
    console.log(`  ${v.role.padEnd(12)} ${v.hex} → A ${v.all.hex} ΔE ${String(v.all.deltaE).padStart(5)}` +
      `   B ${v.anchor.hex} ΔE ${String(v.anchor.deltaE).padStart(5)}`)
  }
  if (coverageLoss.length) {
    console.log(`\n앵커 1장으로 갈 때 잃는 색 ${coverageLoss.length}개 (ΔE>12)`)
    console.log('  ' + coverageLoss.slice(0, 10).map((c) => `${c.hex}(${c.share}%)`).join(' '))
  }
  console.log(`\n리포트: scripts/pixel-pipeline/palette-report.json`)
  console.log(`스와치: scripts/pixel-pipeline/palette-swatch.html\n`)
}

function renderSwatch(r) {
  const row = (colors) => colors.map((c) =>
    `<div class="sw"><i style="background:${c.hex}"></i><b>${c.hex}</b><s>${c.share}%</s></div>`).join('')
  const v0row = r.v0Compare.map((v) => `
    <tr><td>${v.role}</td>
      <td><i style="background:${v.hex}"></i> <code>${v.hex}</code></td>
      <td><i style="background:${v.all.hex}"></i> <code>${v.all.hex}</code> <em>ΔE ${v.all.deltaE}</em></td>
      <td><i style="background:${v.anchor.hex}"></i> <code>${v.anchor.hex}</code> <em>ΔE ${v.anchor.deltaE}</em></td>
    </tr>`).join('')
  return `<!doctype html><meta charset="utf-8"><title>팔레트 후보 — THEME-2</title>
<style>
body{background:#07131B;color:#DDE9EF;font:14px/1.6 system-ui,-apple-system,sans-serif;margin:0;padding:40px 24px;}
.wrap{max-width:900px;margin:0 auto}
h1{font-size:22px;font-weight:600;margin:0 0 6px}h2{font-size:15px;margin:36px 0 12px;color:#8BA6B5;font-weight:600}
p{color:#8BA6B5;margin:0 0 4px}
.grid{display:flex;flex-wrap:wrap;gap:8px}
.sw{width:88px;background:#0D1F2B;border:1px solid #1C3B4E;border-radius:8px;overflow:hidden;text-align:center}
.sw i{display:block;height:52px}
.sw b{display:block;font:11px ui-monospace,Menlo,monospace;padding:5px 0 1px;font-weight:500}
.sw s{display:block;font:10px ui-monospace,Menlo,monospace;color:#5E7A8A;text-decoration:none;padding-bottom:6px}
table{border-collapse:collapse;width:100%;margin-top:8px}
td,th{text-align:left;padding:9px 10px;border-bottom:1px solid #15303F;font-size:13px}
th{color:#5E7A8A;font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
td i{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;border:1px solid #1C3B4E}
code{font:12px ui-monospace,Menlo,monospace}em{color:#5E7A8A;font-style:normal;font-size:11px}
</style>
<div class="wrap">
<h1>팔레트 후보 — THEME-2 (#28)</h1>
<p>원본 ${r.images.length}장 · 목표 ${r.targetColors}색 · 테마 문서 §4.1 역추출</p>
<h2>후보 A — ${r.candidates.all.label}</h2>
<div class="grid">${row(r.candidates.all.colors)}</div>
<h2>후보 B — ${r.candidates.anchor.label}</h2>
<div class="grid">${row(r.candidates.anchor.colors)}</div>
<h2>v0 제안색 대비 (ΔE 0에 가까울수록 제안대로 나온 것)</h2>
<table><tr><th>역할</th><th>v0 제안</th><th>후보 A 최근접</th><th>후보 B 최근접</th></tr>${v0row}</table>
<h2>후보 B로 갈 때 잃는 색 — ${r.coverageLoss.length}개 (ΔE&gt;12)</h2>
<div class="grid">${row(r.coverageLoss)}</div>
</div>`
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
