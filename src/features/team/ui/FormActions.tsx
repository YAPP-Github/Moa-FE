import { useFormContext } from 'react-hook-form';
import type { CreateTeamFormData } from '@/features/team/model/schema';
import { Button } from '@/shared/ui/button/Button';

interface FormActionsProps {
  isPending: boolean;
}

export function FormActions({ isPending }: FormActionsProps) {
  const { watch } = useFormContext<CreateTeamFormData>();
  const teamName = watch('teamName');

  return (
    <div className="flex justify-end">
      <Button type="submit" variant="primary" size="lg" disabled={!teamName?.trim() || isPending}>
        {isPending ? '생성중' : '만들기'}
      </Button>
    </div>
  );
}
