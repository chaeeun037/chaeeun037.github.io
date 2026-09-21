// 미디언 컷 양자화 — 픽셀 아트 원본에서 제한 팔레트를 역추출한다.
//
// 왜 빈도 가중인가: 생성 원본은 "가짜 픽셀"(고해상)이라 경계마다 안티앨리어싱 중간색이
// 수천 개 섞여 있다. 빈도로 가중하면 넓은 평면색이 상자를 지배하고 중간색은 묻힌다 —
// 픽셀 아트의 "의도된 색"만 남기는 가장 싼 방법이다.

/** RGB 히스토그램 — 키는 packed 정수, 값은 픽셀 수 */
export function histogram(rgba, { alphaThreshold = 128 } = {}) {
  const hist = new Map()
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] < alphaThreshold) continue // 투명 픽셀은 색이 아니다
    const key = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2]
    hist.set(key, (hist.get(key) ?? 0) + 1)
  }
  return hist
}

const unpack = (k) => [(k >> 16) & 255, (k >> 8) & 255, k & 255]

/** 상자를 가장 넓은 축에서 쪼갠다. 반환: {hex, rgb, weight}[] — 빈도 내림차순 */
export function medianCut(hist, targetColors) {
  const entries = [...hist.entries()].map(([k, n]) => ({ rgb: unpack(k), n }))
  if (entries.length === 0) return []

  let boxes = [entries]
  while (boxes.length < targetColors) {
    // **색 범위가 가장 넓은** 상자를 쪼갠다 — 픽셀 수 기준으로 고르면 넓은 평면색(구름의 하늘색 등)
    // 한 덩어리가 슬롯을 계속 먹어 거의 같은 색 25개가 나온다(09-20 실측). 범위 기준이면
    // 이미 촘촘한 군집은 더 안 쪼개지고, 색이 실제로 벌어진 쪽에 슬롯이 간다.
    let target = -1
    let bestRange = -1
    let bestWeight = -1
    boxes.forEach((b, i) => {
      if (b.length < 2) return
      const range = channelRange(b)
      const weight = b.reduce((s, e) => s + e.n, 0)
      if (range > bestRange || (range === bestRange && weight > bestWeight)) {
        bestRange = range; bestWeight = weight; target = i
      }
    })
    if (target === -1) break // 더 쪼갤 수 없다 — 원본 고유색이 목표보다 적다

    const box = boxes[target]
    const ranges = channelRanges(box)
    const axis = ranges.indexOf(Math.max(...ranges))
    box.sort((a, b) => a.rgb[axis] - b.rgb[axis])

    // 픽셀 수 기준 중앙에서 자른다(엔트리 개수 기준이 아니라) — 희귀색이 상자를 끌고 가지 않게
    const total = box.reduce((s, e) => s + e.n, 0)
    let acc = 0
    let cut = 1
    for (let i = 0; i < box.length - 1; i++) {
      acc += box[i].n
      if (acc >= total / 2) { cut = i + 1; break }
    }
    boxes.splice(target, 1, box.slice(0, cut), box.slice(cut))
  }

  return boxes
    .map((box) => {
      const w = box.reduce((s, e) => s + e.n, 0)
      const avg = [0, 1, 2].map((ch) =>
        Math.round(box.reduce((s, e) => s + e.rgb[ch] * e.n, 0) / w))
      return { hex: toHex(avg), rgb: avg, weight: w }
    })
    .sort((a, b) => b.weight - a.weight)
}

function channelRanges(box) {
  return [0, 1, 2].map((ch) => {
    let lo = 255, hi = 0
    for (const e of box) {
      if (e.rgb[ch] < lo) lo = e.rgb[ch]
      if (e.rgb[ch] > hi) hi = e.rgb[ch]
    }
    return hi - lo
  })
}
const channelRange = (box) => Math.max(...channelRanges(box))

/** 지각상 같은 색(ΔE < minDelta)을 합친다 — 팔레트에 중복 슬롯이 남지 않게 */
export function dedupe(palette, minDelta = 4) {
  const kept = []
  for (const c of palette) {
    const dup = kept.find((k) => deltaE(k.rgb, c.rgb) < minDelta)
    if (dup) { dup.weight += c.weight; continue }
    kept.push({ ...c })
  }
  return kept.sort((a, b) => b.weight - a.weight)
}

export const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()

export const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

/** CIE76 색차 — RGB 유클리드보다 사람 눈에 가깝다. 양자화 매핑과 제안색 거리 보고에 쓴다 */
export function deltaE(rgb1, rgb2) {
  const [l1, a1, b1] = rgbToLab(rgb1)
  const [l2, a2, b2] = rgbToLab(rgb2)
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)
}

function rgbToLab([r, g, b]) {
  const f = (v) => {
    v /= 255
    return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92
  }
  const [R, G, B] = [f(r), f(g), f(b)]
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883
  const t = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116)
  const [fx, fy, fz] = [t(x), t(y), t(z)]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}
