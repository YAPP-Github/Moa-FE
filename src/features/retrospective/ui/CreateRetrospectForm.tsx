import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useCreateRetrospect } from '@/features/retrospective/api/retrospective.mutations';
import {
  type CreateRetrospectFormData,
  createRetrospectSchema,
} from '@/features/retrospective/model/schema';
import { CompleteStep } from '@/features/retrospective/ui/steps/CompleteStep';
import { DateTimeStep } from '@/features/retrospective/ui/steps/DateTimeStep';
import { MethodStep } from '@/features/retrospective/ui/steps/MethodStep';
import { ProjectNameStep } from '@/features/retrospective/ui/steps/ProjectNameStep';
import { ReferenceStep } from '@/features/retrospective/ui/steps/ReferenceStep';
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
  const [isComplete, setIsComplete] = useState(false);
  const { mutateAsync: createRetrospect } = useCreateRetrospect(retroRoomId);

  const handleSubmit = async (data: CreateRetrospectFormData) => {
    const filteredUrls = data.referenceUrls?.filter((url) => url.trim() !== '');

    await createRetrospect({
      retroRoomId,
      projectName: data.projectName,
      retrospectDate: format(data.retrospectDate, 'yyyy-MM-dd'),
      retrospectTime: data.retrospectTime,
      retrospectMethod: data.retrospectMethod,
      referenceUrls: filteredUrls?.length ? filteredUrls : undefined,
    });

    setIsComplete(true);
    onSuccess?.();
  };

  const handleComplete = () => {
    onClose();
  };

  if (isComplete) {
    return <CompleteStep onClose={handleComplete} />;
  }

  return (
    <MultiStepForm
      resolver={zodResolver(createRetrospectSchema) as Resolver<CreateRetrospectFormData>}
      defaultValues={{
        projectName: '',
        retrospectTime: '',
        retrospectMethod: undefined as unknown as CreateRetrospectFormData['retrospectMethod'],
        retrospectDate: undefined as unknown as Date,
        referenceUrls: [''],
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
      <MultiStepForm.Step fields={['retrospectMethod']} className="min-h-0 flex-1">
        <MethodStep onClose={onClose} />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['referenceUrls']} className="min-h-0 flex-1">
        <ReferenceStep onClose={onClose} />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}
