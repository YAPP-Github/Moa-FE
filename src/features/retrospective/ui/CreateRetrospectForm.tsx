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
  teamName: string;
  onSuccess?: () => void;
  onClose: () => void;
  onCompleteChange?: (isComplete: boolean) => void;
}

interface CompletedData {
  projectName: string;
  retrospectDate: Date;
  retrospectMethod: string;
}

export function CreateRetrospectForm({
  retroRoomId,
  teamName,
  onSuccess,
  onClose,
  onCompleteChange,
}: CreateRetrospectFormProps) {
  const [completedData, setCompletedData] = useState<CompletedData | null>(null);
  const { mutateAsync: createRetrospect } = useCreateRetrospect(retroRoomId);

  const handleSubmit = async (data: CreateRetrospectFormData) => {
    const filteredUrls = data.referenceUrls?.filter((url) => url.trim() !== '');
    const questions = data.questions.filter((q) => q.trim() !== '');

    await createRetrospect({
      retroRoomId,
      projectName: data.projectName,
      retrospectDate: format(data.retrospectDate, 'yyyy-MM-dd'),
      retrospectMethod: data.retrospectMethod,
      questions,
      referenceUrls: filteredUrls?.length ? filteredUrls : undefined,
    });

    setCompletedData({
      projectName: data.projectName,
      retrospectDate: data.retrospectDate,
      retrospectMethod: data.retrospectMethod,
    });
    onCompleteChange?.(true);
    onSuccess?.();
  };

  const handleComplete = () => {
    onClose();
  };

  if (completedData) {
    return (
      <CompleteStep
        teamName={teamName}
        projectName={completedData.projectName}
        retrospectDate={completedData.retrospectDate}
        retrospectMethod={completedData.retrospectMethod}
        onClose={handleComplete}
      />
    );
  }

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
