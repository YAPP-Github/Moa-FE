import { useState } from 'react';
import { InviteMemberDialog } from './InviteMemberDialog';
import { TeamMemberList } from './TeamMemberList';
import { Button } from '@/shared/ui/button/Button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import IcPlusFitBlue from '@/shared/ui/icons/IcPlusFitBlue';
import IcUser from '@/shared/ui/icons/IcUser';

interface TeamMemberDropdownProps {
  teamId: number;
}

export function TeamMemberDropdown({ teamId }: TeamMemberDropdownProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button type="button" variant="ghost" size="lg" className="gap-[4px] px-[8px] py-[7px]">
            <IcUser className="h-[18px] w-[18px] text-grey-700" />
            <span className="whitespace-nowrap text-sub-title-4 text-grey-700">멤버 관리</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            className="min-w-[160px] rounded-[8px] border border-grey-200 bg-white p-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
          >
            <div className="flex flex-col gap-[16px]">
              <TeamMemberList teamId={teamId} />
              <div className="h-px bg-grey-200" />
              <DropdownMenuItem onSelect={() => setIsInviteOpen(true)} className="cursor-pointer">
                <div className="flex items-center gap-[8px]">
                  <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-blue-500/17">
                    <IcPlusFitBlue />
                  </span>
                  <span className="whitespace-nowrap text-sub-title-3 text-blue-500">추가하기</span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} retroRoomId={teamId} />
    </>
  );
}
