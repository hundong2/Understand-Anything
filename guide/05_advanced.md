# 05. 확장·성능·운영

[가이드 목차](README.md)

## 증분 분석의 정확성

이전 fingerprint와 현재 구조를 비교해 변경 파일을 고른다. 삭제, ignore 변경, cosmetic 변경, 생성물 변경을 모두 재분석으로 처리하면 비용과 baseline 오염 문제가 생긴다. prepare-incremental.mjs, finalize-incremental.mjs, 심볼 검증 도구를 함께 읽는다.

과제: fixture의 gateway를 삭제하고 incoming edge는 남겨 본다. 검증 후 제거된 정보와 영향 결과를 관찰한다. 정상 baseline 갱신은 성공한 분석 후 수행해야 한다.

## 확장 지점

- 언어 추가: core/src/languages 설정과 plugins extractor를 조사하고 fixture로 지원 구문을 명시한다.
- 의미 설명: agents/file-analyzer.md의 입출력 계약을 유지하며 프롬프트를 개선한다. 코드 사실과 추론을 구분한다.
- 그래프 타입: types, schema, alias, dashboard 필터·표시를 함께 확인한다.
- 화면 성능: store의 ID 인덱스와 파생 선택자를 활용해 반복 전체 탐색을 줄인다.
- viewer 동기화: Vite middleware와 viewer 서버는 별도 구현이므로 데이터·소스 정책 변경을 양쪽에 반영한다. tarball에는 빌드 dashboard dist가 포함된다.

## 성능 측정

스캔, 파싱, LLM 배치 토큰·시간, merge, JSON 크기, 브라우저 레이아웃 시간·메모리를 분리한다. JSON 응답이 빨라도 많은 관계의 화면 계산은 느릴 수 있다. 병렬 배치 수를 늘리면 API 한도와 중간 결과 관리 비용이 커진다.

[large-monorepo 벤치마크](../docs/benchmarks/large-monorepo.md)와 scripts/benchmark-large-repo.mjs를 참고한다. 표본·버전·조건을 기록하고 한 번의 빠른 실행을 일반화하지 않는다.

## 신뢰 경계

LLM 분석 시 소스가 호스트 모델 제공자에게 전달될 수 있다. 로컬 viewer가 LLM 없이 동작한다는 설명은 분석 단계의 데이터 전송까지 보장하지 않는다.

viewer는 loopback에 바인딩하고 데이터 endpoint에 토큰을 요구한다. 소스 읽기는 상대 경로, 그래프 파일 목록, 파일 크기 등을 검사한다. 이것을 사용자별 권한 관리나 인터넷 공개용 인증으로 간주하지 않는다. 이 분석이 symlink 경로 처리까지 안전함을 증명하는 것은 아니다.

토큰 URL은 공유 화면·로그에 남기지 않는다. 그래프에도 업무 설명·파일명이 포함되므로 팀 공유 전에 검토한다.

## 다음 실험

1. 구조 그래프와 비즈니스 도메인 그래프의 추상화를 비교한다.
2. 영향 후보를 tested_by와 연결해 회귀 테스트 추천을 실험한다.
3. 순환 의존 fixture로 BFS 종료와 경로 설명을 확인한다.
4. 그래프 commit과 현재 diff로 최신성을 확인한다.
5. upstream 기여는 CONTRIBUTING을 따른다. 이 fork의 자료 작업은 상위 laboratory 계약에 따라 main에 직접 커밋·푸시한다.
