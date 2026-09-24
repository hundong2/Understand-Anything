# 03. 분석 결과가 화면에 도착하는 과정

[가이드 목차](README.md) · [아키텍처](../docs/archify/README.md)

## 실행 진입점

`understand-anything-plugin/skills/understand/SKILL.md`는 호스트 AI 플랫폼이 해석하는 절차다. 모든 단계를 하나의 TypeScript CLI가 자동 실행한다고 이해하면 안 된다. 결정적 도구와 에이전트 프롬프트가 결합되어 있다.

## 대표 경로

1. scan-project.mjs가 Git 목록 또는 폴더 순회로 파일을 수집하고 ignore·언어·분류·digest를 적용한다.
2. extract-structure.mjs와 extract-import-map.mjs가 PluginRegistry, TreeSitterPlugin, 언어 설정을 사용한다. 사전 해석한 importMap을 후속 단계에 전달한다.
3. 호스트가 file-analyzer를 배치별로 실행한다. 중간 결과를 디스크에 기록해 거대한 JSON을 대화 문맥으로 되돌리는 부담을 줄인다.
4. merge-batch-graphs.py가 중간 결과와 import 정보를 조합한다. 레이어·투어·검토가 이어진다. 정확한 순서는 현재 SKILL 문서가 기준이다.
5. 최종 그래프·메타데이터·fingerprint를 데이터 디렉터리에 저장한다. 실패한 중간 결과를 정상 baseline으로 승격하면 안 된다.
6. Vite 개발 서버 또는 별도 viewer가 JSON을 데이터 endpoint로 제공한다.
7. App.tsx가 HTTP 상태 확인과 validateGraph를 실행하고 Zustand에 반영한다. React Flow·검색·파일·투어가 이를 사용한다.

코어 saveGraph/loadGraph는 영속화 API다. full 분석의 모든 쓰기가 이 API를 경유한다고 단정하지 않는다. full SKILL 경로는 직접 쓰기를 지시하기도 하고 증분 finalize는 별도 저장 로직을 가진다.

## 데이터 경계

intermediate/는 후보와 배치 결과, knowledge-graph.json은 화면의 주 입력이다. config.json은 언어·자동 갱신 설정, meta.json과 fingerprints.json은 시점과 변경 판정을 돕는다. diff-overlay.json은 임시 변경 정보를 담는다.

## 브라우저 import 규칙

브라우저는 코어 전체 entry point를 import하면 안 된다. 파일 시스템 등 Node 의존성이 딸려오기 때문이다. `@understand-anything/core/schema`, `/search`, `/types` subpath를 사용한다. App/store가 실제 예다.

## 실습 질문

[02_search.ts](examples/02_search.ts)에서 types 필터를 바꿔 본다. 현재 SearchEngine은 Fuse.js 기반이며 score 0이 최상이다. 임베딩 유사도와 혼동하지 않는다.

[03_impact.ts](examples/03_impact.ts)에서 gateway의 역의존성을 확인한다. payment·checkout은 회귀 테스트 후보이며 실제 장애가 발생한다는 증명은 아니다.
