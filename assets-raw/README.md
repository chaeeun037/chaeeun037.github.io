# assets-raw — 픽셀 에셋 원본

제미나이(나노바나나)가 생성한 **가공 전 원본**이다. 이 디렉토리는 배포되지 않는다 —
`public/` 밖이라 Next.js가 서빙하지 않고, 파이프라인의 **입력**으로만 쓴다.

```
assets-raw/  →  scripts/pixel-pipeline/  →  public/pixel/
             다운스케일(nearest-neighbor)
             32색 팔레트 양자화
             알파 하드컷
```

규격·네이밍 규칙과 파이프라인 전체 스펙은 `docs/theme-expedition-log-v1.0.md` §6.

## 현재 배치 (2026-07-19 수령, 1408×768)

| 파일 | 쓰임 (THEME-2 #28 히어로 씬) |
| --- | --- |
| `clouds-set-of-3.png` | 하늘 — 관측소 진입점 3개 |
| `tent.png` | 육지 — About 지름길 |
| `campfire.png` | 육지 — 대표 기록 보기 CTA |
| `lantern-cross.png` · `lantern-glow.png` · `lantern-cross-sparkles.png` | 육지 — 모든 기록 지름길 (연출 변형 3종) |

**미수령**: 아바타(다이버/백패커), 히어로 수중 씬, 산호·물고기 소품.
테마 문서 §9-1(팔레트 최종 확정)은 이 배치의 베스트 결과물에서 역추출하기로 되어 있다 — Phase T2 진입 전 선행.

원본을 repo에 두는 이유: 파이프라인이 재현 가능해야 하고(팔레트·그리드가 바뀌면 재생성 없이 다시 돌린다),
생성 프롬프트는 결과를 고정하지 못한다.
