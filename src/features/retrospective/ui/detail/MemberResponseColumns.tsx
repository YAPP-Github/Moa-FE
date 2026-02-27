import { useRef, useState } from 'react';
import { ResponseCard } from './ResponseCard';
import type {
  BaseApiResponse,
  ResponsesListResponse,
  RetrospectQuestionItem,
} from '../../model/types';

interface MemberResponseColumnsProps {
  questions: RetrospectQuestionItem[];
  queryResults: { data: BaseApiResponse<ResponsesListResponse> | undefined }[];
  memberName: string;
}

export function MemberResponseColumns({
  questions,
  queryResults,
  memberName,
}: MemberResponseColumnsProps) {
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const draftMapRef = useRef<Map<number, string>>(new Map());

  const handleToggleComment = (responseId: number) => {
    setOpenCommentId((prev) => (prev === responseId ? null : responseId));
  };

  const handleDraftChange = (responseId: number, content: string) => {
    draftMapRef.current.set(responseId, content);
  };

  return (
    <div className="flex gap-8">
      {questions.map((question, idx) => {
        const result = queryResults[idx];
        const responses = result.data?.result?.responses ?? [];
        const memberResponse = responses.find((r) => r.userName === memberName);

        return (
          <div key={question.index} className="w-[354px] shrink-0 overflow-hidden">
            <h3 className="text-title-3 text-grey-1000">
              {idx + 1}. {question.content}
            </h3>
            <div className="mt-3">
              {memberResponse && (
                <ResponseCard
                  response={memberResponse}
                  hideAuthor
                  openCommentId={openCommentId}
                  onToggleComment={handleToggleComment}
                  draft={draftMapRef.current.get(memberResponse.responseId) ?? ''}
                  onDraftChange={handleDraftChange}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
