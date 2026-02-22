import { HttpResponse } from 'msw';

export function successResponse<T>(result: T, code = 'SUCCESS') {
  return HttpResponse.json({
    isSuccess: true,
    code,
    message: '성공',
    result,
  });
}

export function errorResponse(status: number, code: string, message: string) {
  return HttpResponse.json(
    {
      isSuccess: false,
      code,
      message,
      result: null,
    },
    { status }
  );
}
