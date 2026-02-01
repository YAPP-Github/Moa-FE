import {
  RETROSPECT_METHOD_DESCRIPTIONS,
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
        {METHOD_OPTIONS.map((method) => (
          <RadioCardItem
            key={method}
            value={method}
            className="rounded-[10px] border border-grey-200 bg-white px-4 py-[18px] data-[state=checked]:border-blue-500"
          >
            <AccordionRoot>
              <AccordionItem value={method}>
                <div className="flex items-center justify-between">
                  <span className="text-sub-title-2 text-grey-900">
                    {RETROSPECT_METHOD_LABELS[method]}
                  </span>
                  <AccordionTrigger className="p-1 transition-transform data-[state=open]:rotate-180">
                    <SvgIcCaretDown />
                  </AccordionTrigger>
                </div>
                <AccordionContent className="mt-2">
                  <p className="text-body-2 text-grey-600">
                    {RETROSPECT_METHOD_DESCRIPTIONS[method]}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </RadioCardItem>
        ))}
      </RadioCardGroup>
    </div>
  );
}
