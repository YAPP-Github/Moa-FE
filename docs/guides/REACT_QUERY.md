# React Query + Query Key Factory 가이드

- 패키지: `@tanstack/react-query`, `@lukemorales/query-key-factory`
- 참고: [react-query.kro.kr](https://react-query.kro.kr/docs/getting-started)

## Provider 패턴

- `src/app/providers/queryClient.ts`: `QueryClient` 싱글턴 생성 (공통 옵션 포함)
- `src/app/providers/QueryProvider.tsx`: `QueryClientProvider` 래핑, Dev 환경에서만 `ReactQueryDevtools`
- `src/main.tsx`: 앱 루트에서 `QueryProvider` 적용

## Query Key 컨벤션

- 생성 위치: 도메인 인접
  - `entities/<domain>/api/<domain>.queryKeys.ts`
  - `features/<feature>/api/<feature>.queryKeys.ts`
- `query-key-factory` 예시

```ts
// entities/user/api/user.queryKeys.ts
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const userKeys = createQueryKeys("user", {
  all: null,
  list: (params: { page: number }) => [params],
  detail: (id: string) => [id],
});
```

- 사용 시 키는 `userKeys.list(params).queryKey` 형태로 전달
- 파라미터는 객체 1개로 묶어 키 안정성 확보

## 쿼리/뮤테이션 배치 & 네이밍

- 데이터 조회: `entities/<domain>/api/*` 또는 `features/<feature>/api/*`
- UI 훅: `features/<feature>/ui/useSomething.ts`
- 캐싱 정책: `staleTime`/`gcTime`는 도메인 근처에서 선언하여 재사용
- 네트워크 함수: `fetch*`, 뮤테이션: `mutate*`, 훅: `use*Query`/`use*Mutation`

## 옵션 베스트 프랙티스

- `refetchOnWindowFocus`: 기본 false, 필요 시 도메인에서 override
- `staleTime/gcTime`: 도메인 상수로 관리, list/detail 차등 적용
- `enabled`: 의존 데이터 존재 시에만 패치
- `select`: 파생 데이터 메모이즈
- `placeholderData`/`initialData`: 깜빡임 최소화
- 에러 처리: 도메인 단에서 에러 매핑 후 UI로 전달

## 뮤테이션 후 처리

- `invalidateQueries`는 factory key로 명시적으로 호출
- 낙관적 업데이트: `onMutate`에서 snapshot 저장, `onError`에서 rollback, `onSettled`에서 invalidate
- 캐시 병합 로직은 도메인 단위 helper로 분리

## 테스트/디버그

- Dev 환경에서만 `ReactQueryDevtools` 활성화 (`QueryProvider`에서 `import.meta.env.DEV` 사용)
- 네트워크 목킹 시 query key에 의존해 캐시 동작이 일관되도록 유지
