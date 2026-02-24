import { useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MAX_REFERENCE_URLS } from '@/features/retrospective/model/constants';
import {
  type CreateRetrospectFormData,
  ERROR_MESSAGES,
} from '@/features/retrospective/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcBack from '@/shared/ui/icons/IcBack';
import SvgIcClose from '@/shared/ui/icons/IcClose';
import SvgIcPlusBlue from '@/shared/ui/icons/IcPlusBlue';
import { Input } from '@/shared/ui/input/Input';
import { useToast } from '@/shared/ui/toast/Toast';

interface ReferenceUrlStepProps {
  onClose: () => void;
  onBack: () => void;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function ReferenceUrlStep({ onClose, onBack }: ReferenceUrlStepProps) {
  const {
    control,
    register,
    watch,
    formState: { isSubmitting },
  } = useFormContext<CreateRetrospectFormData>();
  const { showToast } = useToast();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [errorIndexes, setErrorIndexes] = useState<Set<number>>(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referenceUrls' as never,
  });

  const referenceUrls = watch('referenceUrls') || [];
  const hasValidUrl = referenceUrls.some((url) => url.trim() !== '' && isValidUrl(url.trim()));

  const handleAddLink = () => {
    setErrorIndexes(new Set());
    append('');
  };

  const handleRemoveLink = (index: number) => {
    setErrorIndexes(new Set());
    remove(index);
  };

  const handleConfirmClick = () => {
    const invalidSet = new Set<number>();

    referenceUrls.forEach((url, index) => {
      const trimmed = url.trim();
      if (trimmed === '' || !isValidUrl(trimmed)) {
        invalidSet.add(index);
      }
    });

    if (invalidSet.size > 0) {
      setErrorIndexes(invalidSet);

      const hasEmptyUrl = referenceUrls.some((url) => url.trim() === '');
      showToast({
        variant: 'warning',
        message: hasEmptyUrl ? ERROR_MESSAGES.EMPTY_URL : ERROR_MESSAGES.INVALID_URL,
      });
      return;
    }

    setErrorIndexes(new Set());
    submitButtonRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <IconButton type="button" variant="ghost" size="sm" onClick={onBack} aria-label="돌아가기">
          <IcBack className="size-5" />
        </IconButton>
        <IconButton type="button" variant="ghost" size="sm" onClick={onClose} aria-label="닫기">
          <SvgIcClose className="size-5" />
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-caption-4 text-grey-600">회고 참고 자료</span>
          <span className="text-title-2 text-grey-1000">회고 참고 자료를 입력해 주세요</span>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="shrink-0 text-caption-4 text-grey-600">링크 {index + 1}</span>
              <div className="min-w-0 flex-1">
                <Input
                  {...register(`referenceUrls.${index}`)}
                  placeholder="참고 링크를 입력해 주세요"
                  error={errorIndexes.has(index)}
                />
              </div>
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLink(index)}
              >
                <SvgIcClose className="size-5" />
              </IconButton>
            </div>
          ))}

          {fields.length < MAX_REFERENCE_URLS && (
            <button
              type="button"
              onClick={handleAddLink}
              className="flex w-fit cursor-pointer items-center gap-2 hover:bg-none"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200">
                <SvgIcPlusBlue className="h-2 w-2" />
              </div>
              <span className="leading-5 text-caption-5 text-blue-500">추가하기</span>
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!hasValidUrl || isSubmitting}
          onClick={handleConfirmClick}
          className="h-[32px] px-[18.5px] py-[7px]"
        >
          확인
        </Button>
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
