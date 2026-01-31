import { useFormContext } from 'react-hook-form';
import type { CreateTeamFormData } from '@/features/team/model/schema';
import { Button } from '@/shared/ui/button/Button';

interface FormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
}

export function FormActions({ onCancel, isPending, isError }: FormActionsProps) {
  const { watch } = useFormContext<CreateTeamFormData>();
  const teamName = watch('teamName');

  return (
    <>
      {isError && (
        <p className="text-sm text-red-500 mb-4">팀 생성에 실패했습니다. 다시 시도해주세요.</p>
      )}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="lg"
          fullWidth
          onClick={onCancel}
          disabled={isPending}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!teamName?.trim() || isPending}
        >
          {isPending ? '생성 중...' : '생성하기'}
        </Button>
      </div>
    </>
  );
}
