/**
 * WriteBottomBar - 하단 고정 바 (미리보기, 회고 정보, 임시저장, 제출하기)
 */

import { Button } from '@/shared/ui/button/Button';

interface WriteBottomBarProps {
  title: string;
  teamName: string;
  onPreview: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
}

export function WriteBottomBar({
  title,
  teamName,
  onPreview,
  onSaveDraft,
  onSubmit,
  isSaving,
  isSubmitting,
}: WriteBottomBarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t border-grey-200 bg-white px-9 py-4">
      {/* Left: 미리보기 + 회고 정보 */}
      <div className="flex items-center gap-[28px]">
        <Button
          variant="ghost"
          size="xl"
          onClick={onPreview}
          className="w-[138px] rounded-[8px] border border-grey-300 text-sub-title-3 text-grey-900"
        >
          미리보기
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold leading-[150%] text-grey-1000">{title}</span>
          {teamName && (
            <>
              <span className="text-caption-4 text-grey-800">·</span>
              <span className="text-caption-4 text-grey-800">{teamName}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: 임시저장 + 제출하기 */}
      <div className="flex items-center gap-[10px]">
        <Button
          variant="ghost"
          size="xl"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="w-[112px] rounded-[8px] text-sub-title-3 text-grey-700"
        >
          임시저장
        </Button>
        <Button
          variant="primary"
          size="xl"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-[178px] rounded-[8px] text-sub-title-3"
        >
          제출하기
        </Button>
      </div>
    </div>
  );
}
