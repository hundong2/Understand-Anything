# 검증 기록

작성일: 2026-09-25

[학습 가이드](README.md)

## 환경과 범위

Windows, Node.js 22.18.0, 고정 pnpm 10.6.2, TypeScript 5.9.3, Vitest 3.2.4에서 검사했다. 설치는 `--frozen-lockfile --ignore-scripts`로 수행하고 필요한 빌드는 명시적으로 실행했다. 개인 플랫폼 설치, LLM 분석, 외부 모델 호출, 릴리스 배포는 수행하지 않았다.

## 결과

| 검사 | 결과 |
| --- | --- |
| 코어 build | 통과 |
| skill build | 통과 |
| dashboard build | 통과; 큰 번들 경고 있음 |
| TypeScript 실습 3종 | 모두 실행 및 assert 통과 |
| 실습 strict typecheck | 통과 |
| 실습 ESLint | 통과 |
| 전체 ESLint | 통과 |
| core tests | 47 files 통과; 1,012 tests 통과, 1 skipped |
| root integration tests | 37 files 통과, 1 skipped; 779 tests 통과, 14 skipped |
| Archify validate/deliver | 9/9, composition 오류·경고 0 |
| Archify browser | 네 desktop 크기 containment 통과 |
| Archify 이미지 검수 | light/dark 네 PNG 실제 확인 통과 |

## 환경 문제와 보정

첫 typecheck는 루트에서 @types/node를 찾지 못했다. 실습 tsconfig의 typeRoots를 코어 패키지에 설치된 타입 경로로 지정한 뒤 통과했다. 의존성을 새로 추가하지 않았다.

첫 통합 테스트는 `C:/Windows/system32/bash.exe` (WSL)를 선택해 cygpath 호출 6개가 실패했고 후속 실행도 멈췄다. 해당 테스트 프로세스를 종료한 뒤 테스트 프로세스의 PATH에 `D:/Program Files/Git/bin`을 앞세우고 workers를 4개로 제한해 다시 실행했다. 전역 PATH는 변경하지 않았다. Windows의 다른 설치 위치에서는 실제 Git Bash의 bin 경로를 사용한다.

```powershell
$env:PATH = 'D:\Program Files\Git\bin;' + $env:PATH
npx --yes pnpm@10.6.2 test --maxWorkers=4
```

npm이 프로젝트 .npmrc의 pnpm 전용 설정에 경고를 출력하고, pnpm은 하위 package.json의 onlyBuiltDependencies 설정을 무시한다고 안내한다. lockfile 의존성 버전은 유지했다. dashboard의 ELK 번들이 500kB를 넘는 Vite 경고도 기존 앱 구성에서 발생했다.

## 번역·링크 검수

기존 한국어 README를 원문 전체 구조와 대조했다. 처음 실행 시 언어 감지/저장, Windows 업데이트·제거, Trae 지원, 에이전트 사용 명령 표, 소개·배지 누락을 보완했다. 한국어 출력 예제의 `--language ko`는 원문 `zh`를 학습 언어에 맞춘 기존 번역 선택으로 유지했다.

원본·한국어 README의 Codex/Gemini/OpenCode/Vibe/Trae 배지는 실제 설치 절로 이동하도록 명시적 anchor를 추가했다. 원본의 upstream 설치 URL과 라이선스·작성자 표기는 유지했다. fork의 학습 링크와 upstream 제품 배포 URL의 목적을 구분한다.

11개 Markdown 파일의 상대 경로/anchor 84개를 검사해 깨진 링크 0개를 확인했다. 최종 스테이징의 `git diff --cached --check`도 통과했다. JSON과 source evidence는 Archify validate에서 추가 확인했다.

## 버전

CLAUDE.md의 push 규칙에 따라 plugin·viewer·세 플랫폼 manifest 등 여섯 파일을 `2.9.7 → 2.9.8`로 동기화했다. 이 버전 변경은 fork 문서 작업의 변경 식별이며 upstream 릴리스가 아니다. tarball 업로드나 package publish는 하지 않았다.
