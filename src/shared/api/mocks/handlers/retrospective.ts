import { http } from 'msw';
import {
  analysisResult,
  assistantResult,
  comments,
  emptyResponses,
  getNextRetrospectId,
  references,
  responsesByRetrospect,
  retrospectDetails,
  retrospects,
} from '../fixtures/retrospective';
import { successResponse } from '../utils';

export const retrospectiveHandlers = [
  // GET /api/v1/retro-rooms/:retroRoomId/retrospects — 회고 목록
  http.get('/api/v1/retro-rooms/:retroRoomId/retrospects', ({ params }) => {
    const roomId = Number(params.retroRoomId);
    const list = retrospects[roomId] ?? [];
    return successResponse(list);
  }),

  // POST /api/v1/retrospects — 회고 생성
  http.post('/api/v1/retrospects', async ({ request }) => {
    const body = (await request.json()) as { projectName: string; retroRoomId: number };
    const newId = getNextRetrospectId();
    return successResponse({
      projectName: body.projectName,
      retroRoomId: body.retroRoomId,
      retrospectId: newId,
    });
  }),

  // GET /api/v1/retrospects/:retrospectId — 회고 상세
  http.get('/api/v1/retrospects/:retrospectId', ({ params }) => {
    const id = Number(params.retrospectId);
    const detail = retrospectDetails[id];
    if (detail) return successResponse(detail);

    return successResponse({
      currentUserStatus: 'NOT_PARTICIPATED',
      members: [],
      questions: [{ content: '질문 1', index: 0 }],
      retroCategory: 'KPT',
      retroRoomId: 1,
      startTime: new Date().toISOString(),
      title: `회고 #${id}`,
      totalCommentCount: 0,
      totalLikeCount: 0,
    });
  }),

  // DELETE /api/v1/retrospects/:retrospectId — 회고 삭제
  http.delete('/api/v1/retrospects/:retrospectId', ({ params }) => {
    const id = Number(params.retrospectId);
    for (const roomId of Object.keys(retrospects)) {
      const list = retrospects[Number(roomId)];
      const index = list.findIndex((r) => r.retrospectId === id);
      if (index !== -1) {
        list.splice(index, 1);
        break;
      }
    }
    // SuccessDeleteRetrospectResponse: result is null
    return successResponse(null);
  }),

  // GET /api/v1/retrospects/:retrospectId/export — 회고 내보내기
  http.get('/api/v1/retrospects/:retrospectId/export', () => {
    return successResponse(null);
  }),

  // POST /api/v1/retrospects/:retrospectId/participants — 참여
  http.post('/api/v1/retrospects/:retrospectId/participants', () => {
    return successResponse({
      memberId: 1,
      nickname: '홍길동',
      participantId: Date.now(),
    });
  }),

  // POST /api/v1/retrospects/:retrospectId/submit — 제출
  http.post('/api/v1/retrospects/:retrospectId/submit', ({ params }) => {
    const id = Number(params.retrospectId);
    return successResponse({
      retrospectId: id,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
    });
  }),

  // PUT /api/v1/retrospects/:retrospectId/drafts — 임시저장
  http.put('/api/v1/retrospects/:retrospectId/drafts', ({ params }) => {
    const id = Number(params.retrospectId);
    return successResponse({
      retrospectId: id,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  }),

  // GET /api/v1/retrospects/:retrospectId/responses — 응답 목록
  http.get('/api/v1/retrospects/:retrospectId/responses', ({ params, request }) => {
    const id = Number(params.retrospectId);
    const url = new URL(request.url);
    const category = url.searchParams.get('category') ?? 'QUESTION_1';
    const data = responsesByRetrospect[id]?.[category] ?? emptyResponses;
    return successResponse(data);
  }),

  // POST /api/v1/responses/:responseId/comments — 코멘트 작성
  http.post('/api/v1/responses/:responseId/comments', async ({ params, request }) => {
    const responseId = Number(params.responseId);
    const body = (await request.json()) as { content: string };
    return successResponse({
      commentId: Date.now(),
      content: body.content,
      createdAt: new Date().toISOString().replace('Z', ''),
      responseId,
    });
  }),

  // GET /api/v1/responses/:responseId/comments — 코멘트 목록
  http.get('/api/v1/responses/:responseId/comments', () => {
    return successResponse(comments);
  }),

  // POST /api/v1/responses/:responseId/likes — 좋아요 토글
  http.post('/api/v1/responses/:responseId/likes', ({ params }) => {
    const responseId = Number(params.responseId);
    return successResponse({
      isLiked: true,
      responseId,
      totalLikes: 1,
    });
  }),

  // GET /api/v1/retrospects/:retrospectId/analysis — 분석 결과 조회
  http.get('/api/v1/retrospects/:retrospectId/analysis', ({ params }) => {
    const id = Number(params.retrospectId);
    // 104: 분석 결과 있음, 나머지: 분석 전 (empty state)
    if (id === 104) {
      return successResponse(analysisResult);
    }
    return successResponse(null);
  }),

  // POST /api/v1/retrospects/:retrospectId/analysis — AI 분석
  http.post('/api/v1/retrospects/:retrospectId/analysis', () => {
    return successResponse(analysisResult);
  }),

  // POST /api/v1/retrospects/:retrospectId/questions/:questionId/assistant — AI 어시스턴트
  http.post('/api/v1/retrospects/:retrospectId/questions/:questionId/assistant', () => {
    return successResponse(assistantResult);
  }),

  // GET /api/v1/retrospects/:retrospectId/references — 참고 자료
  http.get('/api/v1/retrospects/:retrospectId/references', ({ params }) => {
    const id = Number(params.retrospectId);
    const refs = references[id] ?? [];
    return successResponse(refs);
  }),
];
