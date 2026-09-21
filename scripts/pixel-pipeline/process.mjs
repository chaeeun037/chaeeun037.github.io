// 에셋 파이프라인 — 원본(assets-raw/)을 배포용 픽셀 에셋(public/pixel/)으로 변환한다.
// 테마 문서 §6.2 순서에 키잉·분리 단계를 앞에 붙였다(§6.2는 3단계만 적지만 실물이 시트라 필요).
//
//   배경 키잉 → 워터마크 제거 → 스프라이트 분리 → 크롭 → 다운스케일 → 팔레트 양자화 → 알파 하드컷
//
// 사용: node scripts/pixel-pipeline/process.mjs [--dry]
// 팔레트: scripts/pixel-pipeline/palette.json (2026-09-20 확정, 6장 통합 역추출)

import sharp from 'sharp'
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deltaE } from './lib/quantize.mjs'
import { detectBackground, keyBackground, labelComponents, isWatermark } from './lib/keying.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const RAW = join(ROOT, 'assets-raw')
const OUT = join(ROOT, 'public', 'pixel')
const DRY = process.argv.includes('--dry')

// 출력 규격. §4.3 그리드(아이콘16/소품32/아바타64/씬320×180)를 기준 높이로 쓰고 폭은 비율 유지로 따라간다
// — 오브젝트가 정사각이 아니라 그리드에 강제로 맞추면 찌그러진다.
// zone/이름은 §6.3 `{zone}-{대상}-{크기}.png`. 히어로 씬 구현 때 최종 크기가 정해지면 여기만 고치면 된다.
const ASSETS = {
  'clouds-set-of-3.png': {
    zone: 'sky',
    split: 3,                  // 관측소 진입점 3개 — 한 장에 들어 있어 낱개로 가른다
    name: (i) => `cloud-${i + 1}`,
    targetHeight: 32,          // 소품 그리드
  },
  'tent.png':                   { zone: 'land', name: () => 'tent',            targetHeight: 48 },
  'campfire.png':               { zone: 'land', name: () => 'campfire',        targetHeight: 48 },
  'lantern-cross.png':          { zone: 'land', name: () => 'lantern',         targetHeight: 64 },
  'lantern-glow.png':           { zone: 'land', name: () => 'lantern-glow',    targetHeight: 64 },
  'lantern-cross-sparkles.png': { zone: 'land', name: () => 'lantern-sparkle', targetHeight: 64 },
  // 관측소 진입 로켓 — 하늘/육지 경계에 선다. 배경이 마젠타라 키잉이 잘 먹는다
  'rocket.png':                 { zone: 'land', name: () => 'rocket',         targetHeight: 112 },
}

const palette = JSON.parse(await readFile(join(HERE, 'palette.json'), 'utf8'))
const PAL = palette.colors.map((c) => c.rgb)

/** 가장 가까운 팔레트 색으로 매핑. 캐시가 없으면 픽셀마다 29번 ΔE를 돌아 느리다 */
const cache = new Map()
function snap(rgb) {
  const key = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]
  const hit = cache.get(key)
  if (hit) return hit
  let best = PAL[0]
  let bestD = Infinity
  for (const p of PAL) {
    const d = deltaE(rgb, p)
    if (d < bestD) { bestD = d; best = p }
  }
  cache.set(key, best)
  return best
}

/** 최근접 이웃 축소 — 보간하면 픽셀 아트의 하드 엣지가 뭉개진다(§4.3) */
function downscaleNearest(rgba, sw, sh, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4)
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(sh - 1, Math.floor((y + 0.5) * sh / dh))
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(sw - 1, Math.floor((x + 0.5) * sw / dw))
      const si = (sy * sw + sx) * 4
      const di = (y * dw + x) * 4
      out[di] = rgba[si]
      out[di + 1] = rgba[si + 1]
      out[di + 2] = rgba[si + 2]
      out[di + 3] = rgba[si + 3]
    }
  }
  return out
}

function cropRgba(rgba, w, box) {
  const out = Buffer.alloc(box.width * box.height * 4)
  for (let y = 0; y < box.height; y++) {
    const src = ((box.top + y) * w + box.left) * 4
    rgba.copy(out, y * box.width * 4, src, src + box.width * 4)
  }
  return out
}

/** 양자화 + 알파 하드컷. 반투명을 남기면 픽셀 경계가 흐려진다(§6.2-3) */
function quantizeAndCut(rgba, alphaThreshold = 128) {
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] < alphaThreshold) {
      rgba[i] = rgba[i + 1] = rgba[i + 2] = rgba[i + 3] = 0
      continue
    }
    const [r, g, b] = snap([rgba[i], rgba[i + 1], rgba[i + 2]])
    rgba[i] = r
    rgba[i + 1] = g
    rgba[i + 2] = b
    rgba[i + 3] = 255
  }
  return rgba
}

async function main() {
  const files = (await readdir(RAW)).filter((f) => f.toLowerCase().endsWith('.png')).sort()
  const unknown = files.filter((f) => !ASSETS[f])
  if (unknown.length) {
    // 조용히 건너뛰지 않는다 — 새 배치가 들어왔는데 변환이 안 된 걸 모르면 안 된다
    console.warn(`⚠️  규격 미정의 원본 ${unknown.length}건 (ASSETS에 추가 필요): ${unknown.join(', ')}`)
  }

  if (!DRY) {
    await rm(OUT, { recursive: true, force: true }) // 옛 산출물이 남으면 지운 에셋이 배포에 살아남는다
    await mkdir(OUT, { recursive: true })
  }

  const manifest = []
  for (const file of files) {
    const cfg = ASSETS[file]
    if (!cfg) continue

    const { data, info } = await sharp(join(RAW, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const { width: w, height: h } = info

    const bg = detectBackground(data, w, h)
    const { rgba } = keyBackground(data, w, h, bg, { tolerance: 10 })

    const comps = labelComponents(rgba, w, h, { minPixels: 40 })
    const largest = comps[0]?.pixels ?? 0
    const marks = comps.filter((c) => isWatermark(c, w, h, largest))
    for (const m of marks) {
      for (let y = m.top; y < m.top + m.height; y++) {
        for (let x = m.left; x < m.left + m.width; x++) rgba[(y * w + x) * 4 + 3] = 0
      }
    }
    const sprites = comps.filter((c) => !marks.includes(c))

    // 낱개로 가를 것인가, 한 덩어리로 볼 것인가.
    // split이 없으면 조각(불똥·반짝이)이 본체와 떨어져 있어도 한 스프라이트로 묶는다 — 합집합 bbox.
    let boxes
    if (cfg.split) {
      boxes = sprites
        .slice(0, cfg.split)
        .sort((a, b) => a.left - b.left) // 좌→우 고정 순서. 픽셀 수로 정렬하면 배치마다 번호가 뒤바뀐다
      if (boxes.length !== cfg.split) {
        console.warn(`⚠️  ${file}: 스프라이트 ${cfg.split}개를 기대했는데 ${boxes.length}개를 찾았다`)
      }
    } else {
      const u = sprites.reduce((a, c) => ({
        left: Math.min(a.left, c.left),
        top: Math.min(a.top, c.top),
        right: Math.max(a.right, c.left + c.width),
        bottom: Math.max(a.bottom, c.top + c.height),
      }), { left: w, top: h, right: 0, bottom: 0 })
      boxes = [{ left: u.left, top: u.top, width: u.right - u.left, height: u.bottom - u.top }]
    }

    for (const [i, box] of boxes.entries()) {
      const cropped = cropRgba(rgba, w, box)
      const dh = cfg.targetHeight
      const dw = Math.max(1, Math.round(box.width * dh / box.height))
      const small = downscaleNearest(cropped, box.width, box.height, dw, dh)
      quantizeAndCut(small)

      const name = `${cfg.zone}-${cfg.name(i)}-${dw}x${dh}.png` // §6.3 네이밍
      if (!DRY) {
        await sharp(small, { raw: { width: dw, height: dh, channels: 4 } })
          .png({ compressionLevel: 9, palette: true })
          .toFile(join(OUT, name))
      }
      manifest.push({ source: file, out: name, from: `${box.width}×${box.height}`, to: `${dw}×${dh}` })
    }
  }

  if (!DRY) {
    await writeFile(join(OUT, 'manifest.json'),
      JSON.stringify({ palette: palette.name, generated: manifest }, null, 2) + '\n')
  }

  console.log(`\n팔레트 ${palette.name} · ${PAL.length}색 · 출력 ${manifest.length}개${DRY ? ' (dry)' : ''}\n`)
  for (const m of manifest) {
    console.log(`  ${m.out.padEnd(34)} ← ${m.source.padEnd(28)} ${m.from} → ${m.to}`)
  }
  console.log()
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
