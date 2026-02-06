/**
 * RetrospectiveContentTab - 회고 내용 탭 컴포넌트
 *
 * 팀원들의 회고 내용을 질문별로 표시하는 컴포넌트
 */

import { useState } from 'react';
import {
  useCreateComment,
  useToggleLike,
} from '@/features/retrospective/api/retrospective.mutations';
import { useComments, useResponses } from '@/features/retrospective/api/retrospective.queries';
import type { ResponseCategory, ResponseListItem } from '@/shared/api/generated/index';
import IcComment from '@/shared/ui/icons/IcComment';
import IcHeartInactive from '@/shared/ui/icons/IcHeartInactive';

// ============================================================================
// Types
// ============================================================================

interface RetrospectiveContentTabProps {
  retrospectId: number;
  questions: string[];
}

// ============================================================================
// Sub-components
// ============================================================================

function CommentSection({ responseId }: { responseId: number }) {
  const [commentInput, setCommentInput] = useState('');
  const { data: commentsData } = useComments(responseId);
  const createCommentMutation = useCreateComment(responseId);

  const comments = commentsData?.result?.comments ?? [];

  const handleSubmit = () => {
    const content = commentInput.trim();
    if (!content) return;

    createCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setCommentInput('');
        },
      }
    );
  };

  return (
    <div className="mt-3">
      {/* 댓글 입력 */}
      <div className="flex gap-3">
        <div className="h-[25px] w-[25px] shrink-0 rounded-full border border-grey-200 bg-[#EAD4FC]" />
        <label className="flex flex-1 cursor-text flex-col rounded-xl border border-grey-200 bg-grey-50 px-3 py-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                handleSubmit();
              }
            }}
            placeholder="댓글로 의견을 남겨보세요"
            className="w-full bg-transparent text-caption-3 font-medium text-grey-900 placeholder:text-grey-500 focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createCommentMutation.isPending}
              className="cursor-pointer rounded-sm bg-blue-500 px-2.5 py-[6px] text-sub-title-5 text-grey-0 disabled:opacity-50"
            >
              남기기
            </button>
          </div>
        </label>
      </div>

      {/* 댓글 리스트 */}
      {comments.length > 0 && (
        <div className="mt-4 max-h-[120px] flex-col gap-3 overflow-y-auto scrollbar-hide">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex gap-2 py-1.5 first:pt-0">
              <div className="h-[25px] w-[25px] shrink-0 rounded-full border border-grey-200 bg-[#EAD4FC]" />
              <div className="flex flex-col gap-1">
                <span className="text-sub-title-4 text-grey-700">{comment.userName}</span>
                <p className="text-long-2 text-grey-900">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

const CATEGORY_MAP: Record<string, ResponseCategory> = {
  all: 'ALL',
  '0': 'QUESTION_1',
  '1': 'QUESTION_2',
  '2': 'QUESTION_3',
  '3': 'QUESTION_4',
  '4': 'QUESTION_5',
};

function RetrospectiveContentTab({ retrospectId, questions }: RetrospectiveContentTabProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | number>('all');
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);

  const category = CATEGORY_MAP[String(activeFilter)] ?? 'ALL';
  const { data: responsesData } = useResponses(retrospectId, category);
  const toggleLikeMutation = useToggleLike();

  const responses = responsesData?.result?.responses ?? [];

  // 질문별로 그룹화 (ALL일 때만 그룹화, 개별 질문 필터일 때는 하나의 그룹)
  const groupedByQuestion: Record<number, ResponseListItem[]> =
    activeFilter === 'all'
      ? // ALL일 때는 각 질문별로 API를 호출하지 않으므로 전체를 하나의 그룹으로 표시
        { 0: responses }
      : { [activeFilter as number]: responses };

  const handleCommentToggle = (responseId: number) => {
    setOpenCommentId(openCommentId === responseId ? null : responseId);
  };

  const handleLikeToggle = (responseId: number) => {
    toggleLikeMutation.mutate(responseId);
  };

  return (
    <div className="flex flex-col overflow-y-auto px-5 pb-8 scrollbar-hide">
      {/* 필터 탭 */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-sub-title-4 transition-colors ${
            activeFilter === 'all' ? 'bg-grey-800 text-grey-0' : 'bg-grey-100 text-grey-800'
          }`}
        >
          전체
        </button>

        <div className="h-[18px] w-px bg-[#DFE1E8]" />

        {questions.map((question, index) => (
          <button
            key={question}
            type="button"
            onClick={() => setActiveFilter(index)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sub-title-4 transition-colors ${
              activeFilter === index ? 'bg-grey-800 text-grey-0' : 'bg-grey-100 text-grey-800'
            }`}
          >
            질문{index + 1}
          </button>
        ))}
      </div>

      {/* 답변 목록 */}
      <div className="mt-4 flex flex-col gap-5">
        {Object.entries(groupedByQuestion).map(([questionIndex, questionResponses]) => (
          <div key={questionIndex} className="flex flex-col">
            {/* 질문 제목 */}
            {activeFilter !== 'all' && questions[Number(questionIndex)] && (
              <h3 className="text-title-4 text-grey-1000">{questions[Number(questionIndex)]}</h3>
            )}

            {/* 답변 목록 */}
            <div className={activeFilter !== 'all' ? 'mt-4 flex flex-col' : 'flex flex-col'}>
              {questionResponses.map((response, answerIndex) => (
                <div key={response.responseId}>
                  {answerIndex > 0 && <div className="my-4 h-px bg-grey-100" />}

                  <div className="flex gap-2">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-grey-200" />

                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-sub-title-4 text-grey-700">{response.userName}</span>

                      <p className="mt-1.5 text-long-2 text-grey-900">{response.content}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleLikeToggle(response.responseId)}
                          className="flex cursor-pointer items-center gap-0.5 text-grey-600"
                        >
                          <IcHeartInactive className="h-4 w-4" />
                          <span className="text-[13px] font-medium">{response.likeCount}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCommentToggle(response.responseId)}
                          className={`flex cursor-pointer items-center gap-0.5 rounded-md px-1 py-0.5 text-grey-600 transition-colors ${
                            openCommentId === response.responseId
                              ? 'bg-grey-300'
                              : 'hover:bg-grey-200 active:bg-grey-300'
                          }`}
                        >
                          <IcComment className="h-4 w-4" />
                          <span className="text-[13px] font-medium">{response.commentCount}</span>
                        </button>
                      </div>

                      {openCommentId === response.responseId && (
                        <CommentSection responseId={response.responseId} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RetrospectiveContentTab };
