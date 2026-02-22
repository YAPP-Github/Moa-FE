import { useRetroRoomMembers } from '../api/team.queries';
import { Avatar } from '@/shared/ui/avatar/Avatar';

interface TeamMemberListProps {
  teamId: number;
}

export function TeamMemberList({ teamId }: TeamMemberListProps) {
  const { data } = useRetroRoomMembers(teamId);
  const members = data?.result ?? [];

  if (members.length === 0) {
    return <span className="text-caption-3 text-grey-500">멤버가 없습니다.</span>;
  }

  return (
    <>
      {members.map((member) => (
        <div key={member.memberId} className="flex items-center gap-[10px]">
          <Avatar size="xs" alt={member.nickname} />
          <span className="text-sub-title-3 text-grey-900">{member.nickname}</span>
        </div>
      ))}
    </>
  );
}
