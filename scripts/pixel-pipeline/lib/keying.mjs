// 배경 키잉 · 스프라이트 분리 — 원본이 "배경 위에 놓인 시트"라서 필요하다.
//
// 테마 문서 §6.2는 다운스케일→양자화→하드컷 3단계만 적고 있고 #28 본문은 "마젠타 키잉"을
// 전제하지만, 실제 수령분(2026-07-19)은 **마젠타가 아니라 짙은 남색 배경**이고 알파 채널도
// 비어 있다(투명 픽셀 0개). 그래서 투명은 여기서 "만들어" 준다 — 이 단계가 없으면
// 배경이 전체 픽셀의 40~90%라 팔레트가 남색으로 뒤덮이고, 다운스케일 시 피사체가 몇 픽셀로 뭉갠다.

import { deltaE } from './quantize.mjs'

/** 테두리 픽셀의 최빈색 = 배경색. 코너만 보면 워터마크 글로우에 끌려간다(우하단이 더 밝다) */
export function detectBackground(rgba, w, h) {
  const hist = new Map()
  const add = (x, y) => {
    const i = (y * w + x) * 4
    const key = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2]
    hist.set(key, (hist.get(key) ?? 0) + 1)
  }
  for (let x = 0; x < w; x++) { add(x, 0); add(x, h - 1) }
  for (let y = 0; y < h; y++) { add(0, y); add(w - 1, y) }

  let best = 0
  let key = 0
  for (const [k, n] of hist) if (n > best) { best = n; key = k }
  return [(key >> 16) & 255, (key >> 8) & 255, key & 255]
}

/**
 * 테두리에서 시작하는 flood fill 로 배경만 투명화한다.
 * 색 전체를 지우지 않고 **바깥과 이어진 영역만** 지우는 이유: 피사체 안쪽에 배경과 같은 색이
 * 있어도(구름 사이 틈, 모닥불 그림자) 구멍이 뚫리지 않게 하기 위해서다.
 * 배경에 노이즈·그라디언트가 있어 tolerance(ΔE)로 허용 범위를 준다.
 */
export function keyBackground(rgba, w, h, bg, { tolerance = 10 } = {}) {
  const out = Buffer.from(rgba)
  const seen = new Uint8Array(w * h)
  const stack = []

  const matches = (p) => {
    const i = p * 4
    return deltaE([out[i], out[i + 1], out[i + 2]], bg) <= tolerance
  }
  const push = (p) => { if (!seen[p]) { seen[p] = 1; stack.push(p) } }

  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x) }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1) }

  let cleared = 0
  while (stack.length) {
    const p = stack.pop()
    if (!matches(p)) continue
    out[p * 4 + 3] = 0
    cleared++
    const x = p % w
    const y = (p / w) | 0
    if (x > 0) push(p - 1)
    if (x < w - 1) push(p + 1)
    if (y > 0) push(p - w)
    if (y < h - 1) push(p + w)
  }
  return { rgba: out, cleared, backgroundRatio: cleared / (w * h) }
}

/** 불투명 픽셀의 연결 요소(8-이웃). 시트 1장에 든 스프라이트를 낱개로 가른다 */
export function labelComponents(rgba, w, h, { alphaThreshold = 128, minPixels = 24 } = {}) {
  const seen = new Uint8Array(w * h)
  const comps = []

  for (let start = 0; start < w * h; start++) {
    if (seen[start] || rgba[start * 4 + 3] < alphaThreshold) continue
    const stack = [start]
    seen[start] = 1
    let minX = w, minY = h, maxX = 0, maxY = 0, count = 0

    while (stack.length) {
      const p = stack.pop()
      const x = p % w
      const y = (p / w) | 0
      count++
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const np = ny * w + nx
          if (seen[np] || rgba[np * 4 + 3] < alphaThreshold) continue
          seen[np] = 1
          stack.push(np)
        }
      }
    }
    if (count >= minPixels) {
      comps.push({
        left: minX, top: minY,
        width: maxX - minX + 1, height: maxY - minY + 1,
        pixels: count,
      })
    }
  }
  return comps.sort((a, b) => b.pixels - a.pixels)
}

/**
 * 제미나이 워터마크(우하단 ✦) 판별.
 * 지우는 게 아니라 **골라내고 이유를 남긴다** — 조용히 버리면 나중에 진짜 소품이 사라져도 모른다.
 * 판정: 우하단 코너 영역에 있고, 가장 큰 스프라이트보다 현저히 작다.
 */
export function isWatermark(comp, w, h, largestPixels) {
  const inCorner = comp.left > w * 0.82 && comp.top > h * 0.74
  const tiny = comp.pixels < largestPixels * 0.05
  return inCorner && tiny
}
