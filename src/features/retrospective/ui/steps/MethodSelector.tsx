import {
  RETROSPECT_METHOD_DESCRIPTIONS,
  RETROSPECT_METHOD_DETAILS,
  RETROSPECT_METHOD_LABELS,
} from '@/features/retrospective/model/constants';
import { RetrospectMethod } from '@/shared/api/generated/index';
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '@/shared/ui/accordion/Accordion';
import SvgIcCaretDown from '@/shared/ui/icons/IcCaretDown';
import SvgIcCheckCircleActive from '@/shared/ui/icons/IcCheckCircleActive';
import SvgIcCheckCircleInactive from '@/shared/ui/icons/IcCheckCircleInactive';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

interface MethodSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const METHOD_OPTIONS = [
  RetrospectMethod.KPT,
  RetrospectMethod.FOUR_L,
  RetrospectMethod.FIVE_F,
  RetrospectMethod.PMI,
  RetrospectMethod.FREE,
] as const;

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <div className="-mx-1 -my-1 flex-1 overflow-y-auto px-1 py-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <RadioCardGroup value={value} onValueChange={onChange} className="flex flex-col gap-3">
        {METHOD_OPTIONS.map((method) => {
          const isSelected = value === method;
          return (
            <RadioCardItem
              key={method}
              value={method}
              className="rounded-[10px] border border-grey-200 bg-white px-4 py-[9px] data-[state=checked]:border-blue-500"
            >
              <AccordionRoot>
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
                    <div className="flex items-center gap-2">
                      <AccordionTrigger className="p-1 transition-transform data-[state=open]:rotate-180">
                        <SvgIcCaretDown />
                      </AccordionTrigger>
                    </div>
                  </div>
                  <AccordionContent className="mt-3">
                    <div className="mb-3 h-px bg-grey-200" />
                    <ul className="ml-[24px] flex flex-col gap-3">
                      {RETROSPECT_METHOD_DETAILS[method]?.map((detail) => (
                        <li key={detail.title} className="flex flex-col gap-0.5">
                          <span className="text-caption-5 text-grey-400">{detail.title}</span>
                          <span className="text-caption-2 text-grey-900">{detail.question}</span>
                        </li>
                      ))}
                    </ul>
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
