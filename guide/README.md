# Understand Anything 한국어 학습 가이드

작성일: 2026-09-25

## 목차

- [출처와 범위](#출처와-범위)
- [한눈에 보기](#한눈에-보기)
- [학습 순서](#학습-순서)
- [코드 리뷰](#코드-리뷰)
- [다음 학습 경로](#다음-학습-경로)

## 출처와 범위

- 대상: [hundong2/Understand-Anything](https://github.com/hundong2/Understand-Anything)
- 분석 revision: `6df3065f1d8ddc2ce3615314d1d493f36d6b1c80` (main)
- 원본: [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything)
- 라이선스: [MIT](../LICENSE). 소스·설정·README 확인일: 2026-09-25.
- [한국어 README](../READMEs/README.ko-KR.md) · [Archify 분석](../docs/archify/README.md) · [검증 기록](validation.md)

입력 URL을 저장소의 한국어 학습 자료 제작 요청으로 해석했다. 이번 작업에서는 개인 AI 플랫폼에 플러그인을 설치하거나 유료 LLM 분석을 실행하지 않았다.

## 한눈에 보기

큰 코드베이스를 이해하려면 파일 목록보다 관계와 근거가 필요하다. 이 도구는 파일·함수·클래스를 노드로, import·호출·포함을 엣지로 만든다. 정적 파서가 구조 정보를 추출하고 AI 플랫폼 에이전트가 의미 설명·레이어·학습 투어를 보완한다. 최종 JSON은 로컬 대시보드에서 읽는다.

구조 추출, 의미 생성, 검증, 표시는 별도 단계다. 파싱에 성공해도 모든 동적 호출을 찾는 것은 아니며 JSON 검증에 성공해도 설명이 사실이라는 뜻은 아니다. 설명을 원본 파일과 대조하는 습관부터 익힌다.

## 학습 순서

| 단계 | 자료 | 완료 기준 |
| --- | --- | --- |
| 기초 | [01 개념과 데이터 모델](01_foundations.md) | 노드·엣지·레이어·투어를 설명한다 |
| 설치 | [02 설치와 첫 실행](02_setup.md) | 코어 빌드와 로컬 예제를 실행한다 |
| 내부 이해 | [03 분석과 탐색 흐름](03_pipeline.md) | 파서와 LLM의 책임을 구별한다 |
| 검증 | [04 테스트와 문제 해결](04_testing.md) | 데이터·서버·화면 오류를 분리한다 |
| 심화 | [05 확장과 운영](05_advanced.md) | 증분 갱신·확장·성능을 검토한다 |
| 실습 | [TypeScript 예제 3종](examples/README.md) | 실제 코어 API로 검증·검색을 수행한다 |

## 코드 리뷰

아래 경로는 `understand-anything-plugin/` 기준이다.

| 모듈 | 책임과 시작점 | 주의점 |
| --- | --- | --- |
| 조율 | `skills/understand/SKILL.md` | 플랫폼이 해석하는 절차이며 독립 Node 서버가 아니다 |
| 스캔 | `skills/understand/scan-project.mjs` | Git 목록, ignore, 분류, digest |
| 구조 | `skills/understand/extract-structure.mjs`, `extract-import-map.mjs` | 언어별 파싱·import 해석 범위 |
| 코어 | `packages/core/src/` | Node persistence와 브라우저 schema/search 분리 |
| 화면 | `packages/dashboard/src/App.tsx`, `store.ts` | HTTP 확인 → 검증 → Zustand → React Flow |
| viewer | `packages/viewer/bin/viewer.mjs` | 빌드 dist와 토큰 제한 데이터·소스 조회 |

확장 지점은 언어 설정/파서, 에이전트 프롬프트, 데이터 스키마, 대시보드 선택자·컴포넌트다. 변경 계층을 먼저 정하고 해당 테스트를 선택한다. 코어 전체 entry point를 브라우저로 가져오면 Node 의존성 문제가 생긴다. [코드 근거](../docs/archify/README.md)를 따라 실행 흐름을 확인한다.

## 다음 학습 경로

1. TypeScript union, ESM, 런타임 스키마 검증.
2. 구문 파서와 심볼 해석, 정적 분석 정확도·재현율.
3. BFS/DFS, 역의존성, 커뮤니티 분할.
4. Zustand 선택자와 React Flow 레이아웃 프로파일링.
5. [기여 지침](../CONTRIBUTING.md)에 따른 작은 파서 개선.
