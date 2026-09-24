# TypeScript 실습 3단계

[가이드](../README.md)

## 준비

Node.js 22.18 이상과 빌드된 코어가 필요하다. 저장소 루트에서 실행한다.

```powershell
npx --yes pnpm@10.6.2 install --frozen-lockfile --ignore-scripts
npx --yes pnpm@10.6.2 --filter @understand-anything/core build
node guide/examples/01_validate.ts
node guide/examples/02_search.ts
node guide/examples/03_impact.ts
npx --yes pnpm@10.6.2 exec tsc -p guide/examples/tsconfig.json
npx --yes pnpm@10.6.2 exec eslint guide/examples
```

## 목표와 결과

| 순서 | 파일 | 배우는 내용 | 예상 |
| --- | --- | --- | --- |
| 1 | [01_validate.ts](01_validate.ts) | 공식 loadGraph·validateGraph, 정상/정제 구분 | 3 nodes, 2 edges, 깨진 edge 삭제 경고 |
| 2 | [02_search.ts](02_search.ts) | 실제 SearchEngine, score·필터 | payment가 첫 결과, class는 빈 결과 |
| 3 | [03_impact.ts](03_impact.ts) | 역의존 BFS와 순환 종료 | gateway 변경 → payment, checkout |

예제는 작은 수작업 그래프를 읽고 표준 출력만 낸다. API 키, 모델 호출, 서버 또는 유료 데이터가 필요 없다. JSON과 toy 코드를 자동 분석한 결과라고 주장하지 않는다.

실행 실패 시 assert가 오류를 발생시키고 종료 코드가 0이 아니게 된다. 임의 수정 후에도 같은 결과가 나오도록 assert를 지우지 말고, 변경한 의미와 기대 결과를 대조한다.

## 데이터

[학습 그래프](fixtures/demo-project/.ua/knowledge-graph.json)는 세 파일의 imports 관계다. 임의로 학습 시점을 나타낸 metadata의 gitCommitHash는 전체 저장소의 분석 증거가 아니다. 소스는 [checkout](fixtures/demo-project/src/checkout.ts), [payment](fixtures/demo-project/src/payment.ts), [gateway](fixtures/demo-project/src/gateway.ts)다.

운영 데이터 폴더를 변경하지 않도록 fixture를 별도 프로젝트에 격리했다. 전체 저장소의 .ua를 덮어쓰지 않는다. 대시보드에서 보는 방법은 [설치 안내](../02_setup.md)에 있다.

## 확장 과제

- 새로운 호출자를 추가하고 역의존성의 순서를 예상한다.
- imports와 contains를 섞고 관계 종류를 제한하는 이유를 설명한다.
- 결과를 학습 투어와 연결하고 원본 줄 번호를 대조한다.
- backward/bidirectional 관계를 지원하려면 인접 목록 구축을 어떻게 바꿀지 설계한다.
