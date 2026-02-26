import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DeleteRetrospectDialog } from './DeleteRetrospectDialog';
import { useDeleteRetrospect } from '../api/retrospective.mutations';
import { getDDayLabel } from '../lib/date';
import { RETROSPECT_METHOD_LABELS, RetrospectListStatus } from '../model/constants';
import type { RetrospectListItem } from '../model/schema';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcMeatball from '@/shared/ui/icons/IcMeatball';
import { useToast } from '@/shared/ui/toast/Toast';

const CARD_CLASS = 'flex h-[141px] w-[284px] flex-col rounded-xl bg-white p-[18px]';

interface RetrospectCardProps {
  item: RetrospectListItem;
  teamId: number;
}

interface CardMenuProps {
  title: string;
  retrospectId: number;
  teamId: number;
  status: string;
}

function CardMenu({ title, retrospectId, teamId, status }: CardMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteRetrospect(teamId);
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    const path =
      status === RetrospectListStatus.COMPLETED
        ? `/teams/${teamId}/retrospects/${retrospectId}`
        : `/teams/${teamId}/retrospects/${retrospectId}/write`;
    const url = `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(url);
      showToast({ variant: 'success', message: '링크가 복사되었습니다.' });
    } catch {
      showToast({ variant: 'warning', message: '링크 복사에 실패했습니다.' });
    }
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(retrospectId, {
      onSuccess: () => {
        showToast({ variant: 'success', message: '회고가 삭제되었습니다.' });
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton variant="ghost" size="xs" shape="square" aria-label="회고 메뉴">
            <IcMeatball width={20} height={20} />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            className="min-w-[118px] rounded-[8px] border border-grey-200 bg-white p-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
          >
            <div className="flex flex-col gap-[12px]">
              <span className="text-caption-4 text-grey-700">{title}</span>
              <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={handleCopyLink}
              >
                <span className="text-sub-title-3 text-grey-900">링크 복사</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <span className="text-sub-title-3 text-red-300">삭제하기</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
      <DeleteRetrospectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={title}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

function CardInfo({ methodLabel, formattedDate }: { methodLabel: string; formattedDate: string }) {
  return (
    <div className="mt-auto flex flex-col gap-[3px]">
      <div className="flex items-center gap-3">
        <span className="text-sub-title-6 text-grey-700">회고 방식</span>
        <span className="text-sub-title-6 text-grey-800">{methodLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sub-title-6 text-grey-700">날짜</span>
        <span className="text-sub-title-6 text-grey-800">{formattedDate}</span>
      </div>
    </div>
  );
}

function formatCardData(item: RetrospectListItem) {
  const date = new Date(item.retrospectDate);
  const formattedDate = format(date, 'yyyy년 M월 d일', { locale: ko });
  const methodLabel = RETROSPECT_METHOD_LABELS[item.retrospectMethod] ?? item.retrospectMethod;
  return { formattedDate, methodLabel };
}

function ActiveCard({ item, teamId }: RetrospectCardProps) {
  const navigate = useNavigate();
  const { formattedDate, methodLabel } = formatCardData(item);
  const dDayLabel = getDDayLabel(item.retrospectDate);

  return (
    <button
      type="button"
      className={`${CARD_CLASS} cursor-pointer text-left`}
      onClick={() => navigate(`/teams/${teamId}/retrospects/${item.retrospectId}/write`)}
    >
      <div className="flex items-center justify-between">
        {dDayLabel ? (
          <span className="flex items-center rounded-[4px] bg-grey-100 px-[10.5px] py-[4px] text-sub-title-5 text-grey-800">
            {dDayLabel}
          </span>
        ) : (
          <span />
        )}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for menu */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop propagation wrapper */}
        <div onClick={(e) => e.stopPropagation()}>
          <CardMenu
            title={item.projectName}
            retrospectId={item.retrospectId}
            teamId={teamId}
            status={item.status}
          />
        </div>
      </div>
      <span className="mt-3 truncate text-title-4 text-black">{item.projectName}</span>
      <CardInfo methodLabel={methodLabel} formattedDate={formattedDate} />
    </button>
  );
}

function CompletedCard({ item, teamId }: RetrospectCardProps) {
  const navigate = useNavigate();
  const { formattedDate, methodLabel } = formatCardData(item);

  return (
    <button
      type="button"
      className={`${CARD_CLASS} cursor-pointer text-left`}
      onClick={() => navigate(`/teams/${teamId}/retrospects/${item.retrospectId}`)}
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-title-4 text-black">{item.projectName}</span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for menu */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop propagation wrapper */}
        <div onClick={(e) => e.stopPropagation()}>
          <CardMenu
            title={item.projectName}
            retrospectId={item.retrospectId}
            teamId={teamId}
            status={item.status}
          />
        </div>
      </div>
      <CardInfo methodLabel={methodLabel} formattedDate={formattedDate} />
      {item.members && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for dropdown
        // biome-ignore lint/a11y/noStaticElementInteractions: stop propagation wrapper
        <div className="mt-[3px] flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <span className="text-sub-title-6 text-grey-700">참여인원</span>
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <button
                type="button"
                className="flex items-center cursor-pointer text-sub-title-6 text-grey-800"
              >
                {item.members.length}명
                <IcChevronDown width={18} height={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent
                align="end"
                className="min-w-[100px] rounded-[8px] border border-grey-200 bg-white p-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
              >
                <div className="flex flex-col gap-[8px]">
                  <span className="text-caption-4 text-grey-700">
                    참여 인원 {item.members.length}명
                  </span>
                  {item.members.map((member) => (
                    <span key={member.memberId} className="text-sub-title-3 text-grey-900">
                      {member.userName}
                    </span>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      )}
    </button>
  );
}

export function RetrospectCard({ item, teamId }: RetrospectCardProps) {
  if (item.status === 'COMPLETED') {
    return <CompletedCard item={item} teamId={teamId} />;
  }
  return <ActiveCard item={item} teamId={teamId} />;
}
