import { useState } from 'react';
import { MemberResponseColumns } from './MemberResponseColumns';
import { MemberSubTabs } from './MemberSubTabs';
import { useQuestionResponses } from '../../api/retrospective.queries';
import { QUESTION_CATEGORIES } from '../../model/constants';
import type {
  ResponseCategory,
  RetrospectMemberItem,
  RetrospectQuestionItem,
} from '../../model/types';

interface MemberTabContentProps {
  retrospectId: number;
  members: RetrospectMemberItem[];
  questions: RetrospectQuestionItem[];
}

export function MemberTabContent({ retrospectId, members, questions }: MemberTabContentProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    members[0]?.memberId ?? null
  );

  const questionCategories = questions.map(
    (_, idx) => QUESTION_CATEGORIES[idx] as ResponseCategory
  );
  const queryResults = useQuestionResponses(retrospectId, questionCategories);

  const selectedMember = members.find((m) => m.memberId === selectedMemberId);

  return (
    <div className="flex h-full gap-6 pt-6 pb-2 pl-6 pr-2">
      <MemberSubTabs
        members={members}
        selectedMemberId={selectedMemberId}
        onSelect={setSelectedMemberId}
      />

      <div className="min-w-0 mt-6 flex-1 overflow-x-auto [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-grey-300">
        {selectedMember && (
          <MemberResponseColumns
            questions={questions}
            queryResults={queryResults}
            memberName={selectedMember.userName}
          />
        )}
      </div>
    </div>
  );
}
