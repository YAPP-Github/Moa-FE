# API 관리 규칙

> Orval 생성 → 도메인별 복사 + TanStack Query + Zod 런타임 검증
> Generated 파일은 참조용이며, 절대로 직접 import하지 않습니다.

---

## 핵심 원칙

1. **Generated = 참조용**: `src/shared/api/generated/`는 OpenAPI 스펙에서 자동 생성된 레퍼런스
2. **직접 import 금지**: 어플리케이션 코드에서 generated 파일을 절대 import하지 않음
3. **도메인별 복사 적용**: 필요한 타입과 API 함수를 각 도메인의 `api/`, `model/` 세그먼트에 복사
4. **런타임 검증**: API 응답은 Zod 스키마로 런타임 검증하여 타입 안전성 확보
5. **도메인 소유권**: 각 도메인이 자신의 API 타입, 함수, 스키마를 소유하고 관리

---

## 폴더 구조

```
src/
├── shared/
│   └── api/
│       ├── instance.ts              # Axios 인스턴스 + Orval mutator (공유 가능)
│       └── generated/
│           └── index.ts             # ⚠️ Orval 자동 생성 (참조용, import 금지)
│
├── entities/
│   └── retrospective/
│       └── model/
│           └── types.ts             # 여러 feature에서 공유하는 도메인 타입
│
└── features/
    └── team/
        ├── api/
        │   ├── team.api.ts          # API 함수 (generated에서 복사)
        │   ├── team.queries.ts      # useQuery hooks
        │   └── team.mutations.ts    # useMutation hooks
        └── model/
            ├── types.ts             # 타입 (generated에서 복사)
            ├── schema.ts            # Zod 스키마 (폼 검증 + API 응답 검증)
            └── constants.ts         # enum/상수 (generated에서 복사)
```

---

## 1. Orval 생성 → 도메인 복사

### 워크플로우

```bash
pnpm run generate:api    # OpenAPI 스펙 → src/shared/api/generated/index.ts
```

생성된 파일에서 도메인에 필요한 부분만 복사:

- **타입/인터페이스** → `{domain}/model/types.ts`
- **enum/상수** → `{domain}/model/constants.ts`
- **API 함수** → `{domain}/api/{domain}.api.ts`

### 타입 복사

```typescript
// features/team/model/types.ts
// (generated/index.ts에서 복사)

export interface RetroRoomCreateRequest {
  retroRoomName: string;
}

export interface RetroRoomListItem {
  retroRoomId: number;
  retroRoomName: string;
  memberCount: number;
}
```

### API 함수 복사

`customInstance`를 사용하여 도메인 API 함수 작성:

```typescript
// features/team/api/team.api.ts
import { customInstance } from '@/shared/api/instance';
import type { RetroRoomCreateRequest, RetroRoomListItem } from '../model/types';

export function listRetroRooms() {
  return customInstance<RetroRoomListItem[]>({
    url: '/api/v1/retro-rooms',
    method: 'GET',
  });
}

export function createRetroRoom(request: RetroRoomCreateRequest) {
  return customInstance<{ retroRoomId: number }>({
    url: '/api/v1/retro-rooms',
    method: 'POST',
    data: request,
  });
}
```

### Enum/상수 복사

```typescript
// features/retrospective/model/constants.ts
export const RetrospectMethod = {
  KPT: 'KPT',
  FOUR_L: 'FOUR_L',
  PMI: 'PMI',
} as const;

export type RetrospectMethod = (typeof RetrospectMethod)[keyof typeof RetrospectMethod];
```

### Import 규칙

```typescript
// ✅ Good - 도메인 자체 파일 사용
import { listRetroRooms } from '@/features/team/api/team.api';
import type { RetroRoomListItem } from '@/features/team/model/types';
import { customInstance } from '@/shared/api/instance';

// ❌ Bad - generated 직접 import 금지
import { getApi } from '@/shared/api/generated';
import type { RetroRoomListItem } from '@/shared/api/generated/index';
```

### 타입 배치 기준

- **여러 feature에서 공유** → `entities/{domain}/model/types.ts`
- **단일 feature 전용** → `features/{feature}/model/types.ts`

---

## 2. TanStack Query 패턴

### QueryClient 설정

```typescript
// app/providers/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Key 컨벤션

단순 배열 패턴. 첫 번째 요소는 도메인, 이후 식별자:

```typescript
['profile', 'me']                        // 프로필
['retroRooms']                           // 팀 목록
['retroRoomMembers', retroRoomId]        // 팀 멤버
['retrospects', retroRoomId]             // 회고 목록
['retrospect', retrospectId]             // 회고 상세
['responses', retrospectId, category]    // 응답 (카테고리별)
['comments', responseId]                 // 댓글
```

### useQuery Hook 작성

```typescript
// features/team/api/team.queries.ts
import { useQuery } from '@tanstack/react-query';
import { listRetroRooms, getRetroRoomMembers } from './team.api';

export function useRetroRoomsQuery() {
  return useQuery({
    queryKey: ['retroRooms'],
    queryFn: listRetroRooms,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useRetroRoomMembersQuery(retroRoomId: number) {
  return useQuery({
    queryKey: ['retroRoomMembers', retroRoomId],
    queryFn: () => getRetroRoomMembers(retroRoomId),
    staleTime: 1000 * 60 * 5,
    enabled: retroRoomId > 0, // ID가 유효할 때만 fetch
  });
}
```

**규칙**:

- `queryFn`에서 도메인 API 함수 호출 (generated의 `getApi()` 사용 금지)
- `staleTime`은 도메인 특성에 맞게 설정 (기본 5분, 자주 변하는 데이터는 2분)
- 의존 데이터가 필요한 쿼리는 `enabled`로 조건부 실행
- `select`로 응답 데이터를 변환할 때는 순수 함수 사용

### useMutation Hook 작성

```typescript
// features/team/api/team.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRetroRoom } from './team.api';
import type { RetroRoomCreateRequest } from '../model/types';

export function useCreateRetroRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RetroRoomCreateRequest) => createRetroRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retroRooms'] });
    },
  });
}
```

**규칙**:

- `onSuccess`에서 관련 쿼리 캐시 무효화
- 연관 데이터가 여러 개면 각각 `invalidateQueries` 호출
- 에러 처리는 컴포넌트에서 `mutateAsync` + try/catch 또는 `onError` 콜백

### 캐시 무효화 전략

```typescript
// 단일 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['retrospect', retrospectId] });

// 목록 + 상세 모두 무효화 (상태 변경 시)
queryClient.invalidateQueries({ queryKey: ['retrospect', retrospectId] });
queryClient.invalidateQueries({ queryKey: ['retrospects'] }); // 목록도 갱신
```

### 네이밍 컨벤션

| 구분 | 패턴 | 예시 |
|---|---|---|
| Query hook | `use{Domain}Query` | `useRetroRoomsQuery` |
| Mutation hook | `use{Action}{Domain}Mutation` | `useCreateRetroRoomMutation` |
| API 함수 | `{action}{Domain}` | `listRetroRooms`, `createRetroRoom` |
| Query key | `['{domain}', ...ids]` | `['retroRooms']`, `['retrospect', id]` |

---

## 3. Zod 런타임 검증

### 전략 개요

Zod 스키마는 **두 가지 목적**으로 사용:

1. **폼 검증**: React Hook Form + `zodResolver`로 사용자 입력 검증
2. **API 응답 검증**: 서버 응답의 런타임 타입 안전성 확보

### 스키마 위치

```
features/{domain}/model/schema.ts
```

하나의 파일에 폼 스키마와 응답 스키마를 같이 배치.

### 폼 검증 스키마

```typescript
// features/team/model/schema.ts
import { z } from 'zod';

// --- 폼 검증 ---

export const createTeamSchema = z.object({
  teamName: z
    .string()
    .min(1, '팀 이름을 입력해주세요.')
    .max(10, '팀 이름은 10글자 이내로 입력해주세요.')
    .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/, '팀 이름은 한글, 영문, 숫자만 가능해요.'),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
```

React Hook Form과 연동:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { createTeamSchema, type CreateTeamFormData } from '../model/schema';

<MultiStepForm
  resolver={zodResolver(createTeamSchema)}
  defaultValues={{ teamName: '' }}
  onSubmit={handleSubmit}
>
```

### API 응답 검증 스키마

서버 응답을 런타임에 검증하여 예상치 못한 데이터 구조를 사전에 차단:

```typescript
// features/team/model/schema.ts
import { z } from 'zod';

// --- API 응답 검증 ---

export const retroRoomItemSchema = z.object({
  retroRoomId: z.number(),
  retroRoomName: z.string(),
  memberCount: z.number(),
});

export const retroRoomListSchema = z.array(retroRoomItemSchema);

export type RetroRoomListItem = z.infer<typeof retroRoomItemSchema>;
```

### API 함수에서 검증 적용

```typescript
// features/team/api/team.api.ts
import { customInstance } from '@/shared/api/instance';
import { retroRoomListSchema } from '../model/schema';

export async function listRetroRooms() {
  const data = await customInstance({
    url: '/api/v1/retro-rooms',
    method: 'GET',
  });
  return retroRoomListSchema.parse(data);
}
```

**규칙**:

- API 함수에서 `schema.parse(data)` 호출
- 검증 실패 시 `ZodError`가 throw되어 React Query의 에러 핸들링으로 전달
- 타입은 스키마에서 `z.infer`로 추출 (별도 interface 정의 불필요)

### 스키마에서 타입 추출 (Single Source of Truth)

응답 검증 스키마가 있으면 **별도 interface 정의 없이** 스키마에서 타입 추출:

```typescript
// features/team/model/schema.ts

// 스키마 정의
export const retroRoomItemSchema = z.object({
  retroRoomId: z.number(),
  retroRoomName: z.string(),
  memberCount: z.number(),
});

// 타입은 스키마에서 추출
export type RetroRoomListItem = z.infer<typeof retroRoomItemSchema>;
```

```typescript
// ✅ Good - 스키마에서 추출한 타입 사용
import type { RetroRoomListItem } from '../model/schema';

// ❌ Bad - 스키마와 별도로 interface 중복 정의
import type { RetroRoomListItem } from '../model/types'; // 스키마와 동기화 안됨
```

**검증이 없는 타입**은 기존처럼 `model/types.ts`에 유지:

```typescript
// features/team/model/types.ts
// 검증 불필요한 요청 타입 등
export interface RetroRoomCreateRequest {
  retroRoomName: string;
}
```

### 스키마 네이밍 컨벤션

| 구분 | 패턴 | 예시 |
|---|---|---|
| 폼 스키마 | `{action}{Domain}Schema` | `createTeamSchema` |
| 폼 타입 | `{Action}{Domain}FormData` | `CreateTeamFormData` |
| 응답 스키마 | `{domain}{Item\|Detail\|List}Schema` | `retroRoomItemSchema` |
| 응답 타입 | `{Domain}{Item\|Detail\|List}` | `RetroRoomListItem` |

### 백엔드 응답 래퍼 (Base Response)

백엔드의 모든 응답은 `{ isSuccess, code, message, result }` 래퍼로 감싸져 있음.
`shared/api/schema.ts`에 제네릭 헬퍼를 정의하여 각 도메인에서 재사용:

```typescript
// shared/api/schema.ts
import { z } from 'zod';

export const baseResponseSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: resultSchema,
  });
```

각 도메인에서는 `result` 스키마만 넘기면 래퍼 검증까지 자동:

```typescript
// features/team/model/schema.ts
import { z } from 'zod';
import { baseResponseSchema } from '@/shared/api/schema';

const retroRoomItemSchema = z.object({
  retroRoomId: z.number(),
  retroRoomName: z.string(),
  memberCount: z.number(),
});

// 래퍼 + result 검증 한번에
export const retroRoomListResponseSchema = baseResponseSchema(
  z.array(retroRoomItemSchema)
);

export type RetroRoomListItem = z.infer<typeof retroRoomItemSchema>;
```

API 함수에서 사용:

```typescript
// features/team/api/team.api.ts
import { customInstance } from '@/shared/api/instance';
import { retroRoomListResponseSchema } from '../model/schema';

export async function listRetroRooms() {
  const data = await customInstance({
    url: '/api/v1/retro-rooms',
    method: 'GET',
  });
  return retroRoomListResponseSchema.parse(data);
}
```

---

## API 변경 시 업데이트 프로세스

```bash
pnpm run generate:api        # 1. 재생성
git diff src/shared/api/     # 2. 변경 사항 확인
# 3. 도메인의 schema.ts, types.ts, *.api.ts 수동 업데이트
pnpm run build               # 4. 검증
```

---

## 공유 가능 항목

| 파일 | import 가능 | 용도 |
|---|---|---|
| `shared/api/instance.ts` | ✅ | Axios 인스턴스, `customInstance` mutator |
| `shared/api/schema.ts` | ✅ | `baseResponseSchema` 제네릭 헬퍼 |
| `shared/api/generated/*` | ❌ | 레퍼런스 전용, 직접 import 금지 |

---

## 체크리스트

새 API를 추가하거나 변경할 때:

- [ ] `@/shared/api/generated`에서 직접 import하고 있지 않은가?
- [ ] API 함수가 도메인의 `api/{domain}.api.ts`에 정의되어 있는가?
- [ ] 응답 스키마가 `model/schema.ts`에 정의되어 있는가?
- [ ] API 함수에서 `schema.parse(data)`로 런타임 검증하는가?
- [ ] 응답 타입은 스키마에서 `z.infer`로 추출했는가?
- [ ] Query hook의 `queryKey`가 컨벤션을 따르는가?
- [ ] Mutation의 `onSuccess`에서 관련 캐시를 무효화하는가?
- [ ] 빌드가 통과하는가?

---

**마지막 업데이트**: 2026-02-09
