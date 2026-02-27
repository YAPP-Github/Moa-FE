import { useState } from 'react';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import { JoinTeamDialog } from '@/features/team/ui/JoinTeamDialog';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcPlusGrey from '@/shared/ui/icons/IcPlusGrey';
import IcTooltip from '@/shared/ui/icons/IcTooltip';

interface SidebarListHeaderProps {
  title: string;
}

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="h-[38px] pl-[14px] py-[7px] flex items-center justify-between">
      <span className="text-sub-title-4 text-grey-700 truncate">{title}</span>
      <div className="relative group">
        {!isDropdownOpen && (
          <IcTooltip className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100" />
        )}
        <IconButton
          shape="square"
          variant="tertiary"
          size="xs"
          aria-label="팀 추가하기"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <IcPlusGrey className="w-[10px] h-[10px]" />
        </IconButton>
        {isDropdownOpen && (
          <>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay for closing dropdown */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop overlay for closing dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute top-[calc(100%+20px)] right-[-34px] z-20 w-max rounded-[8px] border border-grey-200 bg-grey-0 p-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] flex flex-col gap-3">
              <span className="text-[13px] font-normal text-grey-500">팀 추가하기</span>
              <button
                type="button"
                className="cursor-pointer text-left text-sub-title-3 text-grey-900"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsCreateOpen(true);
                }}
              >
                새로운 팀 생성하기
              </button>
              <button
                type="button"
                className="cursor-pointer text-left text-sub-title-3 text-grey-900"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsJoinOpen(true);
                }}
              >
                기존 팀 참여하기
              </button>
            </div>
          </>
        )}
      </div>
      <CreateTeamDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <JoinTeamDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
    </div>
  );
}
