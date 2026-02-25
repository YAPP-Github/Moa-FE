import { useState } from 'react';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import { JoinTeamDialog } from '@/features/team/ui/JoinTeamDialog';
import { Button } from '@/shared/ui/button/Button';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcNote from '@/shared/ui/logos/IcNote';

export function NoTeamEmptyState() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <IcNote />

          <p className="text-[20px] text-[#4E5968] font-semibold leading-none">
            회고를 시작하려면 팀 생성이 필요해요
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1 px-[10px] py-2"
            >
              <IcPlus className="w-3 h-3" /> 팀 생성하기
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsJoinOpen(true)}
              className="px-[10px] py-2"
            >
              기존 팀 참여하기
            </Button>
          </div>
        </div>
      </div>

      <CreateTeamDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <JoinTeamDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
    </>
  );
}
