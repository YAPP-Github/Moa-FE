# moa — 함께 성장하는 회고 경험을 모아

> 팀의 회고를 한 곳에 모아, 솔직한 경험을 통해 함께 성장하는 회고 서비스

<br />

## 서비스 소개

**moa**는 팀 단위 회고를 체계적으로 진행할 수 있도록 돕는 웹 서비스입니다.

- 팀을 만들고 회고를 생성해 팀원을 초대하세요.
- KPT, 4L, PMI 등 다양한 회고 방법론을 활용해 회고를 작성할 수 있어요.
- AI 어시스턴트가 더 솔직하고 깊은 회고를 작성할 수 있도록 도와줘요.
- 팀원들의 답변에 공감하고 댓글을 남기며 서로의 경험을 나눠보세요.

<br />

## 주요 기능

| 기능 | 설명 |
|---|---|
| 팀 관리 | 팀 생성, 초대 링크 공유, 팀원 관리 |
| 회고 생성 | KPT / 4L / PMI 방법론 기반 회고 템플릿 |
| 회고 작성 | AI 어시스턴트 지원, 임시저장 |
| 회고 열람 | 팀원 답변 확인, 좋아요, 댓글 |
| 회고 분석 | 제출 현황 및 결과 분석 |

<br />

## 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | Vite 7 + React 19 |
| Language | TypeScript 5.9 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 + CVA + tailwind-merge |
| State | Zustand 5 |
| Data Fetching | TanStack React Query 5 + Axios |
| Forms | React Hook Form 7 + Zod 4 |
| Linting | Biome |
| Testing | Vitest 4 + Testing Library |
| Package Manager | pnpm 10 |

<br />

## 시작하기

### 요구사항

- Node.js `>=22.12.0`
- pnpm `10`

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# Mock API로 개발 서버 실행 (MSW)
pnpm dev:mock

# 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 환경 변수

루트에 `.env` 파일을 생성하고 아래 변수를 설정하세요.

```env
VITE_API_BASE_URL=https://your-api-url.com
```

<br />

## 프로젝트 구조

[Feature-Sliced Design](https://feature-sliced.design/) 아키텍처를 기반으로 구성되어 있습니다.

```
src/
├── app/        # 앱 초기화, Provider, 라우팅
├── pages/      # 라우트 단위 페이지
├── widgets/    # 독립 UI 블록
├── features/   # 사용자 목표 상호작용 단위
├── entities/   # 비즈니스 도메인 모델
└── shared/     # 공통 UI, 유틸, API 설정
```

<br />

## 스크립트

```bash
pnpm lint          # 린트 검사
pnpm lint:fix      # 린트 자동 수정
pnpm test          # 테스트 실행
pnpm test:watch    # 테스트 watch 모드
pnpm storybook     # Storybook 실행
pnpm generate:api  # OpenAPI 스펙으로 API 타입 생성
pnpm generate:svg  # SVG → React 컴포넌트 생성
```

<br />

## 팀

**YAPP 27기 Web Team 3** — [GitHub](https://github.com/YAPP-Github/27th-Web-Team-3-FE)
