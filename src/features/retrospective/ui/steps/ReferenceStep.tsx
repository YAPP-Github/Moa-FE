import { useFieldArray, useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import SvgIcClose from '@/shared/ui/icons/IcClose';
import SvgIcPlus from '@/shared/ui/icons/IcPlus';
import { Input } from '@/shared/ui/input/Input';

interface ReferenceStepProps {
  onClose: () => void;
}

export function ReferenceStep({ onClose }: ReferenceStepProps) {
  const {
    control,
    register,
    formState: { isSubmitting },
  } = useFormContext<CreateRetrospectFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referenceUrls' as never,
  });

  const handleAddLink = () => {
    append('');
  };

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">회고에 참고할 자료가 있나요?</span>
            <span className="mt-1 text-body-2 text-grey-700">
              파일을 업로드하면 팀원들이 회고에 참고할 수 있어요
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="shrink-0 text-caption-4 text-grey-600">링크 {index + 1}</span>
              <div className="min-w-0 flex-1">
                <Input
                  {...register(`referenceUrls.${index}`)}
                  placeholder="참고 링크를 입력해 주세요"
                />
              </div>
              <IconButton variant="ghost" size="sm" onClick={() => remove(index)}>
                <SvgIcClose />
              </IconButton>
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleAddLink}
            className="w-fit gap-2 bg-transparent text-blue-500 hover:bg-transparent"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200">
              <SvgIcPlus className="h-3 w-3 text-blue-500" />
            </div>
            <span>추가하기</span>
          </Button>
        </div>
      </div>

      <div className="shrink-0 flex justify-end gap-2 pt-4">
        <Button type="submit" variant="tertiary" size="lg" disabled={isSubmitting}>
          건너뛰기
        </Button>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          확인
        </Button>
      </div>
    </div>
  );
}
