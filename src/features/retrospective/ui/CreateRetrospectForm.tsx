import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import type { Resolver } from 'react-hook-form';
import { useCreateRetrospect } from '@/features/retrospective/api/retrospective.mutations';
import {
  type CreateRetrospectFormData,
  createRetrospectSchema,
} from '@/features/retrospective/model/schema';
import { DateTimeStep } from '@/features/retrospective/ui/steps/DateTimeStep';
import { MethodStep } from '@/features/retrospective/ui/steps/MethodStep';
import { ProjectNameStep } from '@/features/retrospective/ui/steps/ProjectNameStep';
import { ReferenceStep } from '@/features/retrospective/ui/steps/ReferenceStep';
import { ApiError } from '@/shared/api/error';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';
import { useToast } from '@/shared/ui/toast/Toast';

interface CreateRetrospectFormProps {
  retroRoomId: number;
  onSuccess?: () => void;
  onClose: () => void;
}

export function CreateRetrospectForm({
  retroRoomId,
  onSuccess,
  onClose,
}: CreateRetrospectFormProps) {
  const { mutateAsync: createRetrospect } = useCreateRetrospect(retroRoomId);
  const { showToast } = useToast();

  const handleSubmit = async (data: CreateRetrospectFormData) => {
    const filteredUrls = data.referenceUrls?.filter((url) => url.trim() !== '');
    const questions = data.questions.filter((q) => q.trim() !== '');

    try {
      await createRetrospect({
        retroRoomId,
        projectName: data.projectName,
        retrospectDate: format(data.retrospectDate, 'yyyy-MM-dd'),
        retrospectMethod: data.retrospectMethod,
        questions,
        referenceUrls: filteredUrls?.length ? filteredUrls : undefined,
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '올바른 URL 형식을 확인해 주세요!';
      showToast({ variant: 'warning', message });
      return;
    }

    showToast({ variant: 'success', message: '회고 생성 완료!' });
    onSuccess?.();
    onClose();
  };

  return (
    <MultiStepForm
      resolver={zodResolver(createRetrospectSchema) as Resolver<CreateRetrospectFormData>}
      defaultValues={{
        projectName: '',
        retrospectMethod: undefined as unknown as CreateRetrospectFormData['retrospectMethod'],
        retrospectDate: undefined as unknown as Date,
        referenceUrls: [''],
        questions: [''],
      }}
      onSubmit={handleSubmit}
      className="min-h-0 flex-1"
    >
      <MultiStepForm.Step fields={['projectName']} className="flex-1">
        <ProjectNameStep onClose={onClose} />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['retrospectDate']} className="flex-1">
        <DateTimeStep onClose={onClose} />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['retrospectMethod', 'questions']} className="min-h-0 flex-1">
        <MethodStep onClose={onClose} />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['referenceUrls']} className="min-h-0 flex-1">
        <ReferenceStep onClose={onClose} />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}
