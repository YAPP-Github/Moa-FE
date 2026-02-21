import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  RETROSPECT_METHOD_DESCRIPTIONS,
  RETROSPECT_METHOD_DETAILS,
  RETROSPECT_METHOD_LABELS,
  RetrospectMethod,
} from '@/features/retrospective/model/constants';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { AccordionContent, AccordionItem, AccordionRoot } from '@/shared/ui/accordion/Accordion';
import { Button } from '@/shared/ui/button/Button';
import SvgIcCaretDown from '@/shared/ui/icons/IcCaretDown';
import SvgIcCheckCircleActive from '@/shared/ui/icons/IcCheckCircleActive';
import SvgIcCheckCircleInactive from '@/shared/ui/icons/IcCheckCircleInactive';
import SvgIcEdit from '@/shared/ui/icons/IcEdit';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

interface MethodSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  onEditQuestions?: () => void;
}

const METHOD_OPTIONS = [
  RetrospectMethod.KPT,
  RetrospectMethod.FOUR_L,
  RetrospectMethod.FIVE_F,
  RetrospectMethod.PMI,
  RetrospectMethod.FREE,
] as const;

export function MethodSelector({ value, onChange, onEditQuestions }: MethodSelectorProps) {
  const { watch } = useFormContext<CreateRetrospectFormData>();
  const [expandedMethod, setExpandedMethod] = useState<string | undefined>(undefined);

  const formQuestions = watch('questions') || [];

  const handleChange = (method: string) => {
    onChange(method);
    setExpandedMethod(method);
  };

  const handleCardClick = (method: string, isSelected: boolean) => {
    if (isSelected) {
      return;
    }
    setExpandedMethod((prev) => (prev === method ? undefined : method));
  };

  const isOpen = (method: string, isSelected: boolean) => {
    if (isSelected) return true;
    return expandedMethod === method;
  };

  const getQuestions = (method: string, isSelected: boolean): string[] => {
    // 선택된 방식은 폼 데이터에서 읽음 (편집 결과 반영)
    if (isSelected) return formQuestions.filter((q) => q.trim() !== '');
    // 미선택 방식은 상수에서 읽음
    return RETROSPECT_METHOD_DETAILS[method] ?? [];
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <RadioCardGroup value={value} onValueChange={handleChange} className="flex flex-col gap-3">
        {METHOD_OPTIONS.map((method) => {
          const isSelected = value === method;
          const open = isOpen(method, isSelected);
          const questions = getQuestions(method, isSelected);
          return (
            <RadioCardItem
              key={method}
              value={method}
              className="rounded-[10px] border border-grey-200 bg-white px-4 py-[18px] data-[state=checked]:border-blue-500"
              onClick={() => handleCardClick(method, isSelected)}
            >
              <AccordionRoot value={open ? method : undefined} onValueChange={() => {}}>
                <AccordionItem value={method}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <SvgIcCheckCircleActive className="h-[16px] w-[16px] shrink-0" />
                      ) : (
                        <SvgIcCheckCircleInactive className="h-[16px] w-[16px] shrink-0" />
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-title-5 ${
                            isSelected ? 'text-blue-500' : 'text-grey-900'
                          }`}
                        >
                          {RETROSPECT_METHOD_LABELS[method]}
                        </span>
                        <span
                          className={`text-caption-3 ${
                            isSelected ? 'text-blue-500' : 'text-grey-800'
                          }`}
                        >
                          {RETROSPECT_METHOD_DESCRIPTIONS[method]}
                        </span>
                      </div>
                    </div>
                    <SvgIcCaretDown
                      width={20}
                      height={20}
                      className={`${open ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <AccordionContent className="mt-3">
                    <div className="mb-3 h-px bg-grey-200" />
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-title-6 text-grey-900">전체 질문</span>
                        {isSelected && (
                          <Button
                            type="button"
                            variant="tertiary"
                            size="sm"
                            className="flex items-center text-caption-5 grey-900 px-[6px] py-[4.5px] gap-[5px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditQuestions?.();
                            }}
                          >
                            <SvgIcEdit width={14} height={14} />
                            질문 편집
                          </Button>
                        )}
                      </div>
                      <ul className="flex flex-col gap-2">
                        {questions.map((question, index) => (
                          <li key={question} className="flex items-baseline gap-2">
                            <span className="shrink-0 text-sub-title-6 text-grey-700">
                              질문 {index + 1}
                            </span>
                            <span className="text-caption-2 text-grey-900">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AccordionRoot>
            </RadioCardItem>
          );
        })}
      </RadioCardGroup>
    </div>
  );
}
