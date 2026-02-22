import type { RetrospectMemberItem } from '../../model/types';
import { cn } from '@/shared/lib/cn';

interface MemberSubTabsProps {
  members: RetrospectMemberItem[];
  selectedMemberId: number | null;
  onSelect: (memberId: number) => void;
}

export function MemberSubTabs({ members, selectedMemberId, onSelect }: MemberSubTabsProps) {
  return (
    <nav className="flex w-[84px] shrink-0 flex-col gap-3">
      {members.map((member) => (
        <button
          key={member.memberId}
          type="button"
          className={cn(
            'cursor-pointer rounded-[8px] px-[25px] py-[8.5px] text-center text-sub-title-4 transition-colors',
            selectedMemberId === member.memberId
              ? 'bg-blue-200 text-blue-500'
              : 'bg-grey-100 text-grey-900'
          )}
          onClick={() => onSelect(member.memberId)}
        >
          <span className="truncate">{member.userName}</span>
        </button>
      ))}
    </nav>
  );
}
