# Understand Anything 코드 아키텍처

작성일: 2026-09-25

[대화형 HTML](architecture.html) · [원본 JSON](architecture.json) · [시각 검증 contact sheet](architecture.visual-check.html) · [학습 가이드](../../guide/README.md)

## 분석 대상과 범위

- 저장소: https://github.com/hundong2/Understand-Anything
- 분석 revision: `6df3065f1d8ddc2ce3615314d1d493f36d6b1c80`
- 주 경로: 코드베이스 분석 조율 → 구조/의미 분석 → JSON → 로컬 서버 → 대시보드.
- 7개 구성요소, 6개 관계, 18개 코드/실행 지침 근거로 범위를 제한했다.
- 도메인, 위키, Figma 분석, homepage, 모든 증분 분기는 지도에 넣지 않았다.

한국어로 설명을 작성했다. Archify가 한국어 Viewer locale을 지원하지 않아 `meta.locale`을 생략했으며 고정 Viewer UI와 `<html lang>`은 영어 fallback이다. 다이어그램 내용은 한국어다.

## 실행 흐름과 근거

아래 경로는 `understand-anything-plugin/` 기준이다. JSON의 sources는 실제 저장소 상대 경로를 사용하며 코드 패널에서 원격 분석 revision으로 이동한다.

| 구성요소 | 근거 | 의미 |
| --- | --- | --- |
| AI 코딩 플랫폼 | skills/understand/SKILL.md:275–295 | 프로젝트 스캔을 조율하는 호스트 절차 |
| 분석·조립 | skills/understand/SKILL.md:341–395; merge-batch-graphs.py:1277–1342 | 배치 file-analyzer와 결정적 merge |
| 정적 도구 | scan-project.mjs:60–96; extract-structure.mjs:58–90; packages/core/src/plugins/tree-sitter-plugin.ts:32–62 | Node core 로딩, registry와 WASM 파서 |
| JSON | skills/understand/SKILL.md:811–836; packages/core/src/persistence/index.ts:7–24,86–126 | 최종 출력과 신규/레거시 데이터 폴더, 읽기·쓰기 API |
| 서버 | packages/viewer/bin/viewer.mjs:308–391; packages/dashboard/vite.config.ts:15–39 | 데이터 endpoint, 토큰, loopback, Vite 파일 탐색 |
| 대시보드 | packages/dashboard/src/App.tsx:144–170; store.ts:366–395; components/GraphView.tsx:1544–1562 | fetch 오류 확인, 검증, store, React Flow |
| 브라우저용 코어 | packages/core/src/schema.ts:563–607; search.ts:25–61; packages/dashboard/src/store.ts:1–8 | 정제·검증과 Fuse.js 검색 subpath |

## 관계를 읽는 방법

주 경로는 정보가 최종 사용자에게 도착하는 방향이다. AI 플랫폼의 배치 조율은 프로세스 안의 단순 함수 호출이 아니라 플랫폼이 SKILL/agent 정의를 해석하는 작업이다. 정적 도구 분기는 분석 단계가 스캔·구조 추출 도구를 이용함을 뜻하며 결과는 파일과 후속 입력으로 돌아온다. 모든 파서 출력과 에이전트 반환 경로를 중복해서 그리지 않았다.

JSON → 서버는 디스크 읽기, 서버 → 대시보드는 토큰을 포함한 요청에 대한 JSON 응답을 뜻한다. 네트워크 시작 주체는 브라우저의 fetch다. 읽기 방향을 표시한 것으로 서버가 브라우저에 unsolicited push를 한다는 뜻이 아니다. 대시보드 → 브라우저용 코어는 로컬 import/API 호출이다.

`saveGraph`를 모든 출력의 단일 저장 서비스로 그리지 않았다. full SKILL 절차는 최종 파일 쓰기를 직접 지시하며 증분 finalize 도구에는 별도 쓰기 로직이 있다. 저장 폴더를 공유한다는 사실과 동일 함수를 호출한다는 사실을 구분했다.

## 상태와 신뢰 경계

영속 데이터는 프로젝트의 `.ua/` JSON이며 레거시 `.understand-anything/`가 있으면 우선 사용한다. DB 서버를 운영하는 구조가 아니다. `database` 아이콘은 파일 영속 저장을 나타낸다. 중간 배치 JSON은 디스크 작업 공간에, UI 선택·필터·검색 상태는 Zustand에, 토큰은 브라우저 sessionStorage에 보관된다.

배포 viewer는 127.0.0.1에 바인딩하고 데이터 endpoint는 토큰 검사를 거친다. file-content 조회에는 상대 경로와 그래프 파일 목록 검사가 있다. 코드 내 보안 검사의 존재를 확인했을 뿐 인터넷 공개 배포의 안전성이나 symlink 우회 부재를 인증하지 않는다. Vite와 viewer는 병행 구현이므로 둘의 기능을 합쳐 하나의 가상 서비스라고 해석하지 않는다.

AI 분석 시 네트워크 전송과 모델 제공자는 호스트 설정에 따라 달라진다. 특정 모델·프로토콜·클라우드 소유권은 추정하지 않았다. viewer의 로컬 열람 경로와 LLM 분석 비용은 구분해야 한다.

## 테스트·빌드 근거

루트 package.json/pnpm-workspace.yaml, core/package.json, dashboard/package.json과 CLAUDE.md에서 개발 명령과 패키지 경계를 확인했다. 코어 schema/search/persistence 테스트는 데이터 계약을 검증한다. 브라우저 코드는 core 전체 Node entry point 대신 /schema, /search, /types를 사용한다. 검증의 실제 결과와 제한은 [validation.md](../../guide/validation.md)에 기록한다.

## 검증 receipt

```text
diagram_type: architecture
output: D:/workspace/laboratory/Understand-Anything/docs/archify/architecture.html
specification_sha256: e61867e1b05eb71f74f8e5b3c272aa3ece9e0d23f2199e7eaed35a90face9958
artifact_sha256: dc41fd760d2849fd75e985b3868c2cf36c8bd18d6bc74e7d68563da2d9942aeb
specification_bytes: 6417
artifact_bytes: 712269
validation: 9/9 showcase, 0 errors, 0 warnings
browser_evidence: passed
visual_review: passed
correction_rounds: 0
```

- 결정적 검증: repo-root source 검증 18개, artifact 9/9, composition 오류·경고 0.
- 자동 브라우저: [receipt](architecture.visual-check.json)의 현재 artifact SHA와 일치. 1440×900, 1600×1000, 1920×1080, 2048×1320에서 가로·세로 넘침 없음.
- 시각 검수: 1440×900 및 2048×1320 light/dark PNG 네 장을 실제 이미지 도구로 열어 확인했다. 노드·카드 잘림, 관계 교차, 라벨 겹침, 대비 문제 없음. 큰 화면에서 주 패널과 카드가 균형 있게 배치됨.
- 첫 deliver 이전 검증에서 라벨 위치와 viewBox 폭을 수정했다. deliver 이후 시각 수정은 없어 correction_rounds는 0이다.
- 자동 receipt의 `visualReview: pending`은 도구가 지각적 검수를 승인하지 않는다는 뜻이다. 위 별도 검수 기록이 이미지 확인 결과다.

## 재생성

설치된 Archify 폴더에서 아래 명령을 사용한다. candidate 수정 후 반드시 다시 validate한다.

```powershell
node bin/archify.mjs validate architecture <repo>/docs/archify/architecture.json --repo-root <repo> --quality showcase --json
node bin/archify.mjs deliver architecture <repo>/docs/archify/architecture.json <repo>/docs/archify/architecture.html --repo-root <repo> --quality showcase --json
node bin/archify.mjs visual-check <repo>/docs/archify/architecture.html --json
```
