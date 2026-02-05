import { useEffect, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  type CreateRetrospectFormData,
  ERROR_MESSAGES,
} from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import SvgIcClose from '@/shared/ui/icons/IcClose';
import SvgIcPlusBlue from '@/shared/ui/icons/IcPlusBlue';
import { Input } from '@/shared/ui/input/Input';
import { useToast } from '@/shared/ui/toast/Toast';

interface ReferenceStepProps {
  onClose: () => void;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function ReferenceStep({ onClose }: ReferenceStepProps) {
  const {
    control,
    register,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting, errors },
  } = useFormContext<CreateRetrospectFormData>();
  const { showToast } = useToast();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referenceUrls' as never,
  });

  const referenceUrls = watch('referenceUrls') || [];

  // 스텝 마운트 시 참고자료 초기화 (최초 1회만 실행)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    setValue('referenceUrls', ['']);
  }, []);

  const handleAddLink = () => {
    append('');
  };

  const handleConfirmClick = async () => {
    // 빈 문자열이 아닌 URL만 검증 대상
    const nonEmptyUrls = referenceUrls.map((url) => url.trim());
    const hasInvalidUrls = nonEmptyUrls.some((url) => !isValidUrl(url));

    if (hasInvalidUrls) {
      // trigger로 zod validation 실행하여 에러 메시지 가져오기
      await trigger('referenceUrls');

      // formState.errors에서 에러 메시지 추출
      const urlErrors = errors.referenceUrls;
      let errorMessage = ERROR_MESSAGES.INVALID_URL; // 기본값 (schema와 동일)

      if (Array.isArray(urlErrors)) {
        const firstError = urlErrors.find((err) => err?.message);
        if (firstError?.message) {
          errorMessage = firstError.message;
        }
      }

      showToast({
        variant: 'warning',
        message: errorMessage,
      });
      return;
    }

    // 검증 통과 시 숨겨진 submit 버튼 클릭
    submitButtonRef.current?.click();
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
                <SvgIcClose className="size-5" />
              </IconButton>
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleAddLink}
            className="w-fit gap-2 text-blue-500 hover:bg-blue-50"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200">
              <SvgIcPlusBlue className="h-2 w-2" />
            </div>
            <span>추가하기</span>
          </Button>
        </div>
      </div>

      <div className="shrink-0 flex justify-end gap-2 pt-4">
        <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting}>
          건너뛰기
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          onClick={handleConfirmClick}
        >
          확인
        </Button>
        {/* 검증 통과 후 제출을 위한 숨겨진 버튼 */}
        <button
          ref={submitButtonRef}
          type="submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
