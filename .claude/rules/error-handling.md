# 에러 핸들링 규칙

> 계층적 에러 핸들링: 아래 계층에서 공통 처리하고, 위에서는 예외만 다룬다.
> HTTP Status 기반 분류 + 서버 메시지 자동 표시

---

## 핵심 원칙

1. **HTTP Status 기반**: 백엔드 커스텀 코드(`RETRO4092` 등)가 아닌 HTTP Status로 에러 분류
2. **서버 메시지 활용**: 서버가 내려주는 한국어 `message`를 그대로 토스트에 표시
3. **글로벌 우선**: mutation 에러는 글로벌에서 자동 처리, 컴포넌트에서는 특별한 UI 동작만
4. **최소 catch**: 컴포넌트 `catch` 블록은 토스트 이외의 동작이 필요할 때만 사용

---

## 4계층 구조

```
Layer 4: Error Boundary         ← 렌더링 크래시 방어
Layer 3: Component              ← 특별한 UI 동작이 필요할 때만
Layer 2: React Query Global     ← mutation 에러 → 서버 메시지 토스트
Layer 1: Axios Interceptor      ← HTTP Status 기반 분류 + 인증 처리
```

---

## Layer 1: Axios Interceptor

AxiosError를 HTTP Status 기반으로 분류하고 `ApiError`로 통일.

### ApiError 클래스

```typescript
// shared/api/error.ts
class ApiError extends Error {
  constructor(
    public status: number, // HTTP Status (0이면 네트워크 에러)
    public code: string,   // 서버 에러 코드 (극소수 컴포넌트 분기용)
    message: string,       // 사용자에게 보여줄 메시지
  ) {
    super(message);
  }
}
```

### 처리 흐름

```
AxiosError 수신
  ├─ response 없음 (네트워크/타임아웃)
  │   → ApiError(0, 'NETWORK_ERROR', '네트워크 연결을 확인해주세요')
  │
  ├─ 401 → 토큰 갱신 시도
  │   └─ 갱신 실패 → onSessionExpired()
  │
  ├─ response.data에 message 있음
  │   → ApiError(status, data.code, data.message)  ← 서버 메시지 그대로 전달
  │
  └─ 그 외 (파싱 불가)
      → ApiError(status, 'SERVER_ERROR', '서버에 문제가 생겼습니다')
```

### 구현

```typescript
// shared/api/instance.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!error.response) {
      return Promise.reject(
        new ApiError(0, 'NETWORK_ERROR', '네트워크 연결을 확인해주세요')
      );
    }

    const { status, data } = error.response;

    // 401: 토큰 갱신 (기존 로직 유지)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // ... 기존 토큰 갱신 로직 ...
    }

    // 서버 ErrorResponse → message 그대로 전달
    if (data && typeof data === 'object' && 'message' in data) {
      const errorData = data as { code?: string; message: string };
      return Promise.reject(
        new ApiError(status, errorData.code ?? `HTTP_${status}`, errorData.message)
      );
    }

    return Promise.reject(
      new ApiError(status, `HTTP_${status}`, '서버에 문제가 생겼습니다')
    );
  }
);
```

---

## Layer 2: React Query Global

Mutation 실패 시 서버 메시지를 자동 토스트. 컴포넌트에서 `catch`로 토스트를 띄울 필요 없음.

### QueryClient 설정

```typescript
// app/providers/queryClient.ts
import { QueryClient, MutationCache } from '@tanstack/react-query';
import { ApiError } from '@/shared/api/error';
import { toastStore } from '@/shared/ui/toast/Toast';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipGlobalError) return;

      const message =
        error instanceof ApiError
          ? error.message
          : '알 수 없는 오류가 발생했습니다';

      toastStore.getState().showToast({ variant: 'warning', message });
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false; // 4xx는 재시도 안 함
        }
        return failureCount < 2;
      },
    },
  },
});
```

### meta 타입 확장

```typescript
// shared/api/types.ts
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      skipGlobalError?: boolean;
    };
  }
}
```

### 컴포넌트 변화

```typescript
// Before: 모든 mutation에 try/catch + 하드코딩 메시지
const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
    onSuccess?.();
  } catch {
    showToast({ variant: 'warning', message: '회고 생성에 실패했습니다.' });
  }
};

// After: 에러는 글로벌에서 처리, 성공만 다루면 됨
const handleSubmit = async (data) => {
  await mutation.mutateAsync(data);
  onSuccess?.();
};
```

---

## Layer 3: Component

### 판단 기준

> **"토스트 말고 다른 행동이 필요한가?"**
>
> - **아니오** → Layer 2에 맡김 (대부분)
> - **예** → 컴포넌트에서 처리

### 컴포넌트 분기가 필요한 경우

| 상황 | 에러 코드 | 필요한 동작 |
|---|---|---|
| AI 어시스턴트 횟수 초과 | `AI4032` | 버튼 비활성화 + 안내 텍스트 |
| 이미 제출된 회고 | `RETRO4033` | 완료 화면으로 전환 |
| OAuth 실패 | (401 전체) | /signin 리다이렉트 |

나머지 에러는 서버 메시지 토스트로 충분.

### 패턴 A: 에러 후 네비게이션

```typescript
const processOAuth = async () => {
  try {
    const response = await socialLogin({ provider, code });
    // 성공 처리...
  } catch {
    // 토스트는 Layer 2에서 이미 뜸, 리다이렉트만 추가
    navigate('/signin', { replace: true });
  }
};
```

### 패턴 B: 에러 코드 기반 UI 분기

```typescript
const handleAssistantGenerate = async () => {
  try {
    const response = await assistantMutation.mutateAsync({ content });
    setGuides(response.result.guides);
  } catch (error) {
    if (error instanceof ApiError && error.code === 'AI4032') {
      setAssistantLimitReached(true); // 토스트 대신 버튼 비활성화
    }
  }
};
```

### 패턴 C: 글로벌 토스트 억제

```typescript
// mutation 정의 시 meta로 글로벌 토스트 스킵
export function useSaveDraftMutation(retrospectId: number) {
  return useMutation({
    mutationFn: (request: DraftSaveRequest) => saveDraft(retrospectId, request),
    meta: { skipGlobalError: true },
  });
}

// 컴포넌트에서 자체 에러 메시지
const handleSaveDraft = async () => {
  saveDraftToStorage(id, answers); // 로컬 저장은 항상 성공
  try {
    await saveDraftMutation.mutateAsync({ ... });
    showToast({ variant: 'success', message: '임시저장 되었어요!' });
  } catch {
    showToast({ variant: 'warning', message: '서버 저장에 실패했지만, 로컬에 저장되었어요.' });
  }
};
```

---

## Layer 4: Error Boundary

API 에러가 아닌 런타임 에러(undefined 접근, 렌더링 에러 등) 방어.

### 배치

```
App
├── GlobalErrorBoundary            ← 최후의 방어선
│   ├── AuthProvider
│   │   └── Route: /teams/:teamId
│   │       └── PageErrorBoundary  ← 페이지 단위 fallback
│   │           └── TeamDashboardPage
```

- **GlobalErrorBoundary**: 전체 앱 감싸기. "문제가 발생했습니다" + 새로고침 버튼
- **PageErrorBoundary**: 각 라우트 감싸기. 해당 페이지만 fallback, 사이드바/헤더 유지

---

## 부록: 백엔드 에러 응답

> 프론트에서 에러 코드를 관리할 필요 없음. `message`만 표시하면 됨.

```json
{
  "isSuccess": false,
  "code": "RETRO4092",
  "message": "이미 회고방 멤버입니다.",
  "result": null
}
```

에러 코드 체계: `{DOMAIN}{HTTP_STATUS}{SEQUENCE}` (예: `RETRO4092` = 회고 도메인 + 409 + 2번째)

컴포넌트에서 코드 분기가 필요한 건 `AI4032`, `RETRO4033` 등 2~3개뿐.

---

**마지막 업데이트**: 2026-02-09
