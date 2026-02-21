/**
 * RetrospectiveCompletedPanel - 완료된 회고 사이드 패널
 *
 * 완료된 회고 클릭 시 우측에서 나타나는 패널입니다.
 * 회고 내용과 회고 분석 탭을 표시합니다.
 * 진행 중인 회고 패널과 달리 우측 사이드바(참여자, 참고자료)가 없습니다.
 */

import { useDeleteRetrospect } from '@/features/retrospective/api/retrospective.mutations';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import IcClose from '@/shared/ui/icons/IcClose';
import IcMeatball from '@/shared/ui/icons/IcMeatball';
import IcScaleDown from '@/shared/ui/icons/IcScaleDown';
import IcScaleUp from '@/shared/ui/icons/IcScaleUp';
import { useToast } from '@/shared/ui/toast/Toast';

// ============================================================================
// Types
// ============================================================================

interface Retrospect {
  retrospectId: number;
  projectName: string;
  retrospectDate: string;
  retrospectMethod: string;
  retrospectTime: string;
  participantCount?: number;
  totalParticipants?: number;
}

interface RetrospectiveCompletedPanelProps {
  retrospect: Retrospect;
  onClose: () => void;
  isExpanded?: boolean;
  onScaleToggle?: () => void;
}

// ============================================================================
// Component
// ============================================================================

function RetrospectiveCompletedPanel({
  retrospect,
  onClose,
  isExpanded = false,
  onScaleToggle,
}: RetrospectiveCompletedPanelProps) {
  const { showToast } = useToast();
  const deleteRetrospect = useDeleteRetrospect();

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/retrospects/${retrospect.retrospectId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast({ variant: 'success', message: '링크가 복사되었습니다.' });
    } catch {
      showToast({ variant: 'warning', message: '링크 복사에 실패했습니다.' });
    }
  };

  // 내보내기 핸들러 (PDF 파일 다운로드)
  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const exportUrl = `${baseUrl}/api/v1/retrospects/${retrospect.retrospectId}/export`;
    window.open(exportUrl, '_blank');
  };

  const handleDelete = () => {
    deleteRetrospect.mutate(retrospect.retrospectId, {
      onSuccess: () => {
        showToast({ variant: 'success', message: '회고가 삭제되었습니다.' });
        onClose();
      },
      onError: () => {
        showToast({ variant: 'warning', message: '삭제에 실패했습니다.' });
      },
    });
  };

  return (
    <div className="flex h-full flex-col px-5 pt-3">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
            aria-label="닫기"
          >
            <IcClose className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onScaleToggle}
            className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 transition-colors"
            aria-label={isExpanded ? '축소' : '확대'}
          >
            {isExpanded ? <IcScaleDown className="h-5 w-5" /> : <IcScaleUp className="h-5 w-5" />}
          </button>
        </div>

        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="cursor-pointer rounded-md p-1.5 text-grey-500 hover:bg-grey-100 data-[state=open]:bg-grey-100 transition-colors"
              aria-label="더보기"
            >
              <IcMeatball className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[160px]"
              align="end"
              sideOffset={4}
            >
              <div className="text-caption-4 text-grey-700 font-medium">
                {retrospect.projectName}
              </div>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onSelect={handleCopyLink}
              >
                <span className="text-sub-title-3 text-grey-900">링크복사</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onSelect={handleExport}
              >
                <span className="text-sub-title-3 text-grey-900">내보내기</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onSelect={handleDelete}
              >
                <span className="text-sub-title-3 text-red-300">삭제하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </header>

      {/* TODO: CompletedRetrospectiveView 재구현 필요 */}
      <div className="mt-3 flex-1 overflow-hidden bg-white" />
    </div>
  );
}

export {
  RetrospectiveCompletedPanel,
  type RetrospectiveCompletedPanelProps,
  type Retrospect as CompletedRetrospect,
};
