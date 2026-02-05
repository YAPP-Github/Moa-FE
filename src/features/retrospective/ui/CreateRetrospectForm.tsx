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
import { FreeQuestionsStep } from '@/features/retrospective/ui/steps/FreeQuestionsStep';
import { MethodStep } from '@/features/retrospective/ui/steps/MethodStep';
import { ProjectNameStep } from '@/features/retrospective/ui/steps/ProjectNameStep';
import { ReferenceStep } from '@/features/retrospective/ui/steps/ReferenceStep';
import { useRetroRooms } from '@/features/team/api/team.queries';
import { RetrospectMethod } from '@/shared/api/generated/index';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';
import { useToast } from '@/shared/ui/toast/Toast';

interface CreateRetrospectFormProps {
  retroRoomId: number;
  onSuccess?: () => void;
  onClose: () => void;
}

interface CompletedData {
  projectName: string;
  retrospectDate: Date;
  retrospectTime: string;
  retrospectMethod: string;
}

export function CreateRetrospectForm({
  retroRoomId,
  onSuccess,
  onClose,
}: CreateRetrospectFormProps) {
  const [completedData, setCompletedData] = useState<CompletedData | null>(null);
  const [isFreeMethod, setIsFreeMethod] = useState(false);
  const { mutateAsync: createRetrospect } = useCreateRetrospect(retroRoomId);
  const { showToast } = useToast();
  const { data: roomData } = useRetroRooms();

  const currentRoom = roomData?.result?.find((r) => r.retroRoomId === retroRoomId);
  const teamName = currentRoom?.retroRoomName ?? '팀';

  const handleMethodChange = (method: string) => {
    setIsFreeMethod(method === RetrospectMethod.FREE);
  };

  const handleSubmit = async (data: CreateRetrospectFormData) => {
    try {
      const filteredUrls = data.referenceUrls?.filter((url) => url.trim() !== '');

      await createRetrospect({
        retroRoomId,
        projectName: data.projectName,
        retrospectDate: format(data.retrospectDate, 'yyyy-MM-dd'),
        retrospectTime: data.retrospectTime,
        retrospectMethod: data.retrospectMethod,
        referenceUrls: filteredUrls?.length ? filteredUrls : undefined,
      });

      setCompletedData({
        projectName: data.projectName,
        retrospectDate: data.retrospectDate,
        retrospectTime: data.retrospectTime,
        retrospectMethod: data.retrospectMethod,
      });
      onSuccess?.();
    } catch {
      showToast({
        variant: 'warning',
        message: '회고 생성에 실패했습니다. 다시 시도해주세요.',
      });
    }
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
        retrospectTime={completedData.retrospectTime}
        retrospectMethod={completedData.retrospectMethod}
        shareLink=""
        onClose={handleComplete}
      />
    );
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
        freeQuestions: [''],
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
        <MethodStep onClose={onClose} onMethodChange={handleMethodChange} />
      </MultiStepForm.Step>
      {isFreeMethod && (
        <MultiStepForm.Step fields={['freeQuestions']} className="min-h-0 flex-1">
          <FreeQuestionsStep onClose={onClose} />
        </MultiStepForm.Step>
      )}
      <MultiStepForm.Step fields={['referenceUrls']} className="min-h-0 flex-1">
        <ReferenceStep onClose={onClose} />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}
