# 01. 그래프를 읽는 기초

[가이드 목차](README.md)

## 문제를 관계로 바꾸기

checkout이 고장 나면 무엇을 확인해야 할까? checkout이 payment를 import하고 payment가 gateway를 import한다는 관계가 있으면 다음 조사 대상을 좁힐 수 있다.

`GraphNode.id`는 참조 식별자, `name`은 표시 이름이다. 같은 이름도 파일·심볼이 다르면 ID가 달라야 한다. `filePath`와 `lineRange`로 원본 코드에 돌아간다. `summary`는 설명이지 검증된 실행 결과가 아니다.

`GraphEdge`는 source, target, type, direction, weight를 가진다. `checkout → payment`의 imports와 payment 변경의 영향 전파는 반대 방향이다. weight를 보정된 확률이나 장애 가능성으로 해석하지 않는다.

## 네 가지 묶음

| 필드 | 역할 | 예 |
| --- | --- | --- |
| nodes | 조사 대상 | payment.ts |
| edges | 관계 | checkout imports payment |
| layers | 논리 그룹 | UI / Service / Data |
| tour | 읽을 순서 | 진입점 → 결제 → 저장 |

메타데이터의 analyzedAt과 gitCommitHash는 어떤 시점의 설명인지 나타낸다. 파일이 바뀌면 줄 번호와 요약도 달라질 수 있다.

## 정적 분석과 의미 분석

Tree-sitter는 구문 구조를 얻고 extractor가 정의·호출·상속 등을 추출한다. LLM은 설명과 태그를 보완한다. 리플렉션, 동적 import, 런타임 DI, 코드 생성은 단순 구문으로 완전히 해결되지 않을 수 있다.

결정성은 동일 버전·환경·입력·설정에서 판단한다. 분석 범위나 파서 버전을 바꾼 결과까지 같다는 약속은 아니다.

## 용어

| 용어 | 뜻과 역할 |
| --- | --- |
| Knowledge graph | 관계가 있는 노드 집합; 탐색의 데이터 |
| Schema | JSON 형태와 허용 값의 계약 |
| CST | Concrete Syntax Tree; 구체 구문 트리 |
| Fingerprint | 구조·내용의 변경 판정 요약값 |
| Incremental analysis | 변경 부분 중심의 갱신 |
| Layer | 책임을 기준으로 묶은 그룹 |
| Persona | 숙련도에 맞춘 화면 상세 수준 |
| WASM | WebAssembly; 파서·문법 로딩에 사용 |
| Zod | 런타임 데이터 검증 라이브러리 |

## 실습

[01_validate.ts](examples/01_validate.ts)로 정상 그래프와 깨진 edge를 비교한다. validateGraph가 success를 반환해도 issues에 삭제 내역이 있을 수 있다. 화면을 열 수 있음과 모든 정보를 보존함은 별개다.

추가 과제: 존재하지 않는 ID를 layer에 넣고 issues와 최종 데이터를 관찰한다.
