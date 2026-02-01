import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import {
  type CreateRetrospectFormData,
  createRetrospectSchema,
} from '@/features/retrospective/model/schema';
import { DateTimeStep } from '@/features/retrospective/ui/steps/DateTimeStep';
import { ProjectNameStep } from '@/features/retrospective/ui/steps/ProjectNameStep';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

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
  const handleSubmit = async (data: CreateRetrospectFormData) => {
    // TODO: API 연동
    console.log('Form data:', data, retroRoomId);
    onClose();
    onSuccess?.();
  };

  return (
    <MultiStepForm
      resolver={zodResolver(createRetrospectSchema) as Resolver<CreateRetrospectFormData>}
      defaultValues={{
        projectName: '',
        retrospectTime: '',
        retrospectMethod: undefined as unknown as CreateRetrospectFormData['retrospectMethod'],
        retrospectDate: undefined as unknown as Date,
        referenceUrls: [] as string[],
      }}
      onSubmit={handleSubmit}
      className="min-h-0 flex-1"
    >
      <MultiStepForm.Step fields={['projectName']} className="flex-1">
        <ProjectNameStep onClose={onClose} />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['retrospectDate', 'retrospectTime']} className="flex-1">
        <DateTimeStep onClose={onClose} />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}
