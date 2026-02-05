import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { LeaveTeamModal } from '@/features/team/ui/LeaveTeamModal';
import type { RetroRoomListItem } from '@/shared/api/generated/index';
import { cn } from '@/shared/lib/cn';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

interface SidebarTeamItemProps {
  team: RetroRoomListItem;
  isActive: boolean;
  onEditTeamName?: (teamId: number, newName: string) => void;
  onLeaveTeam?: (teamId: number) => void;
}

export function SidebarTeamItem({
  team,
  isActive,
  onEditTeamName,
  onLeaveTeam,
}: SidebarTeamItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(team.retroRoomName);
  const editableRef = useRef<HTMLDivElement>(null);
  const isTransitioningToEditRef = useRef(false);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      setTimeout(() => {
        if (editableRef.current) {
          const element = editableRef.current;
          element.focus();

          // 커서를 맨 뒤로 이동
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false); // false = 맨 뒤로
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  }, [isEditing]);

  const handleSave = () => {
    const currentText = editableRef.current?.textContent || '';
    if (currentText.trim() && currentText !== team.retroRoomName) {
      onEditTeamName?.(team.retroRoomId, currentText);
    }
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      if (editableRef.current) {
        editableRef.current.textContent = team.retroRoomName;
      }
      setIsEditing(false);
      setIsMenuOpen(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <li
      className={cn(
        'group flex items-center justify-between pl-[14px] pr-4 h-10 rounded-[8px] transition-colors relative',
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
      )}
    >
      <Link
        to={`/teams/${team.retroRoomId}`}
        title={team.retroRoomName}
        className="flex-1 min-w-0 text-sub-title-3 rounded text-[#3c3e48]"
      >
        <span className="truncate block">{team.retroRoomName}</span>
      </Link>
      <div
        className={cn(
          'flex items-center transition-opacity shrink-0 relative',
          isEditing
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 has-[[data-state=open]]:opacity-100'
        )}
      >
        <DropdownMenuRoot
          open={isMenuOpen}
          onOpenChange={(open) => {
            // 편집 모드로 전환 중에는 메뉴 닫기 무시
            if (!open && isTransitioningToEditRef.current) {
              isTransitioningToEditRef.current = false;
              return;
            }
            setIsMenuOpen(open);
            if (!open) {
              setIsEditing(false);
              setEditedName(team.retroRoomName);
            }
          }}
        >
          <DropdownMenuTrigger>
            <IconButton
              variant="ghost"
              size="xs"
              aria-label={`${team.retroRoomName} 메뉴`}
              onClick={(e) => e.preventDefault()}
              className="hover:bg-grey-200 data-[state=open]:bg-grey-300 data-[state=open]:rounded-[5px]"
            >
              <IcMeatball className="w-6 h-6" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            {!isEditing && (
              <DropdownMenuContent
                className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[140px]"
                align="end"
                sideOffset={4}
              >
                <div className="text-caption-4 text-grey-700 font-medium truncate max-w-[180px]">
                  {team.retroRoomName}
                </div>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onSelect={() => {
                    isTransitioningToEditRef.current = true;
                    setIsEditing(true);
                  }}
                >
                  <span className="text-sub-title-3 text-grey-900">팀 이름 편집하기</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onSelect={() => {
                    setIsMenuOpen(false);
                    setIsLeaveModalOpen(true);
                  }}
                >
                  <span className="text-sub-title-3 text-red-300">팀 나가기</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenuPortal>
        </DropdownMenuRoot>
        {isEditing && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation to prevent closing
          // biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation to prevent closing
          <div
            className="absolute -left-4 top-[calc(100%+10px)] z-50 w-[266px] p-3 rounded-[8px] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] border border-grey-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: contenteditable is interactive */}
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="outline-none text-[14px] font-semibold text-grey-1000 px-3 py-1.5"
            >
              {editedName}
            </div>
          </div>
        )}
      </div>

      <LeaveTeamModal
        open={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
        teamName={team.retroRoomName}
        teamId={team.retroRoomId}
        onConfirm={(teamId) => {
          onLeaveTeam?.(teamId);
        }}
      />
    </li>
  );
}
