import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import type { RetroRoomCreateResponse } from '@/shared/api/generated/index';
import { Button } from '@/shared/ui/button/Button';
import IcPlus from '@/shared/ui/icons/IcPlus';
import IcNote from '@/shared/ui/logos/IcNote';

export function NoTeamEmptyState() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = (result: RetroRoomCreateResponse) => {
    navigate(`/teams/${result.retroRoomId}`);
  };

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <IcNote />

          <p className="text-[20px] text-[#4E5968] font-semibold leading-none">
            회고를 시작하려면 팀 생성이 필요해요
          </p>

          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="gap-1">
            <IcPlus className="w-3 h-3" /> 팀 생성하기
          </Button>
        </div>
      </div>

      <CreateTeamDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
