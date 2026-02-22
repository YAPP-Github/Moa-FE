import { ResponseCard } from './ResponseCard';
import type {
  BaseApiResponse,
  ResponsesListResponse,
  RetrospectQuestionItem,
} from '../../model/types';

interface MemberResponseColumnsProps {
  questions: RetrospectQuestionItem[];
  queryResults: { data: BaseApiResponse<ResponsesListResponse> }[];
  memberName: string;
}

export function MemberResponseColumns({
  questions,
  queryResults,
  memberName,
}: MemberResponseColumnsProps) {
  return (
    <div className="flex gap-5">
      {questions.map((question, idx) => {
        const result = queryResults[idx];
        const responses = result.data.result?.responses ?? [];
        const memberResponse = responses.find((r) => r.userName === memberName);

        return (
          <div key={question.index} className="w-[354px] shrink-0">
            <h3 className="text-title-3 text-grey-1000">
              {idx + 1}. {question.content}
            </h3>
            <div className="mt-3">
              {memberResponse && <ResponseCard response={memberResponse} hideAuthor />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
