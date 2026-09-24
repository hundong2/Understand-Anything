# 02. 설치부터 첫 탐색까지

[가이드 목차](README.md)

## 환경

개발 checkout은 CLAUDE.md 기준 Node.js 22 이상, pnpm 10 이상이다. 이 가이드의 TypeScript 직접 실행은 Node.js 22.18 이상을 사용한다. packageManager가 고정한 pnpm은 10.6.2다. 배포 viewer README의 Node.js 18 이상 조건은 개발 환경 요구 사항과 구분한다.

저장소 루트에서 실행한다. 이미 서브모듈 안에 있으면 다시 clone할 필요가 없다.

```powershell
node --version
npx --yes pnpm@10.6.2 install --frozen-lockfile --ignore-scripts
npx --yes pnpm@10.6.2 --filter @understand-anything/core build
npx --yes pnpm@10.6.2 --filter @understand-anything/skill build
node guide/examples/01_validate.ts
node guide/examples/02_search.ts
node guide/examples/03_impact.ts
```

--ignore-scripts는 설치 훅을 건너뛰므로 코어 빌드를 별도로 수행한다. 실제 파서 실행에 필요한 문법 자산과 플랫폼 의존성은 빌드·테스트에서 확인한다. 위 실습에는 API 키가 필요 없다.

## 예제 그래프 열기

[예제 프로젝트](examples/fixtures/demo-project/src/checkout.ts)는 학습용 결제 코드이며 `.ua/knowledge-graph.json`도 사람이 작성한 fixture다. 운영 결제 구현이나 LLM 분석 결과가 아니다.

Windows PowerShell:

```powershell
$env:GRAPH_DIR = (Resolve-Path guide/examples/fixtures/demo-project).Path
npx --yes pnpm@10.6.2 dev:dashboard
```

macOS/Linux:

```bash
GRAPH_DIR="$PWD/guide/examples/fixtures/demo-project" npx --yes pnpm@10.6.2 dev:dashboard
```

서버가 출력하는 토큰 포함 URL을 연다. checkout을 검색해 payment와 gateway를 차례로 확인한다. 종료는 해당 터미널에서 Ctrl+C다. 정적 dist만 파일 탐색기로 열면 데이터 API가 생기지 않는다.

## 실제 프로젝트 분석

개인 플랫폼 설치는 [한국어 README](../READMEs/README.ko-KR.md)의 안내를 따른다. 설치 스크립트는 사용자 프로필의 디렉터리와 링크를 변경한다. 이 자료 제작 과정에서는 실행하지 않았다.

설치한 플랫폼의 AI 대화창에서 understand 스킬을 호출하고 한국어를 선택한다. slash 명령 지원 플랫폼의 예:

```text
/understand src --language ko
/understand-dashboard
/understand-explain src/auth/login.ts
```

Codex에서는 README의 `$understand` 형식을 사용한다. PowerShell 명령이 아니라 AI 대화창 호출이다. 저장소에 스킬 파일이 있다는 것만으로 현재 대화에 설치된 것은 아니다.

첫 분석은 작은 범위에서 비용과 품질을 확인한다. `.understand-anything/`가 있으면 레거시 디렉터리가 우선이고 새 프로젝트는 `.ua/`를 사용한다.
