# 04. 검증과 문제 해결

[가이드 목차](README.md) · [실행 기록](validation.md)

## 검증 명령

저장소 루트에서:

```powershell
node guide/examples/01_validate.ts
node guide/examples/02_search.ts
node guide/examples/03_impact.ts
npx --yes pnpm@10.6.2 exec tsc -p guide/examples/tsconfig.json
npx --yes pnpm@10.6.2 exec eslint guide/examples
npx --yes pnpm@10.6.2 --filter @understand-anything/core test
npx --yes pnpm@10.6.2 test
npx --yes pnpm@10.6.2 lint
```

예제는 node:assert/strict로 의미 있는 기대값을 확인한다. 전체 테스트에 실패가 있으면 현재 수정과의 관계를 판단한다. 실제 실행 범위와 결과는 검증 기록에서 확인한다.

## 증상별 진단

| 증상 | 먼저 확인할 것 |
| --- | --- |
| ERR_MODULE_NOT_FOUND | 설치와 core dist 빌드, 실행 디렉터리 |
| TypeScript 실행 오류 | Node 22.18 이상 |
| WASM 파일 없음 | 문법 패키지·자산 경로 |
| 403 | 서버 재시작으로 토큰이 바뀌었는지 |
| 그래프 404 | GRAPH_DIR이 데이터 폴더 자체가 아닌 프로젝트 루트인지 |
| 소스 404 | filePath와 실제 파일·allowlist 일치 여부 |
| 일부 노드 사라짐 | validateGraph issues의 dropped 항목 |
| 오래된 결과 | 레거시 디렉터리 우선순위, 메타데이터·commit |
| 브라우저 Node 모듈 오류 | 코어 전체 entry point를 import했는지 |
| 큰 그래프 화면 지연 | 레이아웃 비용, 필터·검색 재계산 |

## 검증 깊이

KnowledgeGraphSchema 형태 검사와 validateGraph의 정제·참조 검사는 다르다. 후자는 잘못된 일부 항목을 버리면서 진행할 수 있다. 그래서 UI가 경고를 표시한다.

issues가 없는 fixture에서 시작하고 깨진 edge를 넣어 비교한다. 자동 보정이 오류를 숨길 수 있으므로 분석 품질 평가에서는 보정·삭제 개수를 함께 기록한다.

LLM end-to-end 평가는 프로젝트 revision, 모델 설정, 언어, ignore, 최초/증분 여부를 기록한다. JSON 통과만으로 설명 정확도나 중요 심볼 누락을 평가할 수 없다.
