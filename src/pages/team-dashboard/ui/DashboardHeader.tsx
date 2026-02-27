import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TeamMenuDropdown } from './TeamMenuDropdown';
import { CreateRetrospectDialog } from '@/features/retrospective/ui/CreateRetrospectDialog';
import { useLeaveRetroRoom } from '@/features/team/api/team.mutations';
import { retroRoomsQueryOptions } from '@/features/team/api/team.queries';
import { LeaveTeamModal } from '@/features/team/ui/LeaveTeamModal';
import { TeamMemberDropdown } from '@/features/team/ui/TeamMemberDropdown';
import { TeamName } from '@/features/team/ui/TeamName';
import { Button } from '@/shared/ui/button/Button';
import IcPlus from '@/shared/ui/icons/IcPlus';
import { useToast } from '@/shared/ui/toast/Toast';

interface DashboardHeaderProps {
  teamId: number;
  teamName: string;
}

export function DashboardHeader({ teamId, teamName }: DashboardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const leaveRetroRoom = useLeaveRetroRoom();
  const { showToast } = useToast();

  const handleLeaveConfirm = async (roomId: number) => {
    const cachedData = queryClient.getQueryData(retroRoomsQueryOptions.queryKey);
    const remainingTeams = (cachedData?.result ?? []).filter((t) => t.retroRoomId !== roomId);

    await leaveRetroRoom.mutateAsync(roomId);
    showToast({ variant: 'success', message: '팀 나가기가 완료되었어요!' });

    if (remainingTeams.length > 0) {
      navigate(`/teams/${remainingTeams[remainingTeams.length - 1].retroRoomId}`, {
        replace: true,
      });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <TeamName
          teamId={teamId}
          teamName={teamName}
          isEditing={isEditing}
          onEditEnd={() => setIsEditing(false)}
        />
        <div className="flex items-center gap-[14px]">
          <TeamMemberDropdown teamId={teamId} />
          <TeamMenuDropdown
            teamName={teamName}
            onEditTeamName={() => setIsEditing(true)}
            onLeaveTeam={() => setIsLeaveOpen(true)}
          />
        </div>
      </div>
      <div>
        <Button
          variant="primary"
          size="md"
          className="gap-[6px] px-[10px] py-[7.5px] text-sub-title-5"
          onClick={() => setIsCreateOpen(true)}
        >
          <IcPlus className="h-[12px] w-[12px]" />
          회고 추가하기
        </Button>
      </div>

      <CreateRetrospectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        retroRoomId={teamId}
      />

      <LeaveTeamModal
        open={isLeaveOpen}
        onOpenChange={setIsLeaveOpen}
        teamName={teamName}
        teamId={teamId}
        onConfirm={handleLeaveConfirm}
      />
    </div>
  );
}
