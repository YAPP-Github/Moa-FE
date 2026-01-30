import {
  Children,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  type Path,
  type Resolver,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { cn } from '@/shared/lib/cn';

// ============================================================================
// Types
// ============================================================================

/**
 * MultiStepForm 컴포넌트 Props
 *
 * @template T - 폼 데이터 타입 (FieldValues 확장)
 */
interface MultiStepFormProps<T extends FieldValues> {
  /** react-hook-form Resolver (zodResolver(schema) 형태로 전달) */
  resolver: Resolver<T>;
  /** 폼 초기값 */
  defaultValues?: DefaultValues<T>;
  /** 폼 제출 핸들러 - 모든 Step 완료 후 호출 */
  onSubmit: (data: T) => void | Promise<void>;
  /** Step 컴포넌트들 */
  children: ReactNode;
  /** 추가 className */
  className?: string;
}

/**
 * MultiStepForm.Step 컴포넌트 Props
 */
interface StepProps<T extends FieldValues = FieldValues> {
  /** 이 Step에서 검증할 필드 목록 */
  fields?: Path<T>[];
  /** Step 내용 */
  children: ReactNode;
  /** 추가 className */
  className?: string;
}

/**
 * Step Context 값
 */
interface StepContextValue {
  /** 현재 Step 인덱스 (0-based) */
  currentStep: number;
  /** 전체 Step 수 */
  totalSteps: number;
  /** 첫 번째 Step 여부 */
  isFirstStep: boolean;
  /** 마지막 Step 여부 */
  isLastStep: boolean;
  /** 다음 Step으로 이동 (검증 성공 시 true 반환) */
  goToNextStep: () => Promise<boolean>;
  /** 이전 Step으로 이동 */
  goToPrevStep: () => void;
  /** 특정 Step으로 이동 */
  goToStep: (step: number) => void;
  /** 현재 Step의 필드 목록 설정 */
  setCurrentFields: (fields: string[]) => void;
}

// ============================================================================
// Step Context
// ============================================================================

const StepContext = createContext<StepContextValue | null>(null);

export function useStepContext(): StepContextValue {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepContext must be used within a MultiStepForm');
  }
  return context;
}

// ============================================================================
// Step Provider
// ============================================================================

interface StepProviderProps {
  totalSteps: number;
  children: ReactNode;
}

function StepProvider({ totalSteps, children }: StepProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const currentFieldsRef = useRef<string[]>([]);
  const { trigger } = useFormContext();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const setCurrentFields = useCallback((fields: string[]) => {
    currentFieldsRef.current = fields;
  }, []);

  const goToNextStep = useCallback(async (): Promise<boolean> => {
    const fields = currentFieldsRef.current;
    const isValid = fields.length > 0 ? await trigger(fields) : true;

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return isValid;
  }, [currentStep, totalSteps, trigger]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const value = useMemo<StepContextValue>(
    () => ({
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      goToNextStep,
      goToPrevStep,
      goToStep,
      setCurrentFields,
    }),
    [
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      goToNextStep,
      goToPrevStep,
      goToStep,
      setCurrentFields,
    ]
  );

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
}

// ============================================================================
// MultiStepForm.Step
// ============================================================================

/**
 * Multi-step form의 개별 Step 컴포넌트
 *
 * 각 Step은 검증할 필드 목록을 지정하고, 해당 Step이 활성화될 때만 렌더링됩니다.
 *
 * @example
 * ```tsx
 * <MultiStepForm.Step fields={['nickname']}>
 *   <Field>
 *     <FieldLabel>닉네임</FieldLabel>
 *     <Input {...register('nickname')} />
 *   </Field>
 * </MultiStepForm.Step>
 * ```
 *
 * @example
 * // 복합 Step (여러 필드)
 * ```tsx
 * <MultiStepForm.Step fields={['plan', 'startDate']}>
 *   <Controller
 *     name="plan"
 *     render={({ field }) => (
 *       <RadioCardGroup value={field.value} onValueChange={field.onChange}>
 *         <RadioCardItem value="free">무료</RadioCardItem>
 *         <RadioCardItem value="pro">프로</RadioCardItem>
 *       </RadioCardGroup>
 *     )}
 *   />
 *   <Controller
 *     name="startDate"
 *     render={({ field }) => (
 *       <Calendar selected={field.value} onSelect={field.onChange} />
 *     )}
 *   />
 * </MultiStepForm.Step>
 * ```
 */
function Step<T extends FieldValues>({ fields = [], children, className }: StepProps<T>) {
  const { setCurrentFields } = useStepContext();

  useEffect(() => {
    setCurrentFields(fields as string[]);
  }, [fields, setCurrentFields]);

  return <div className={cn('animate-in fade-in-0 duration-200', className)}>{children}</div>;
}

// ============================================================================
// Step Renderer
// ============================================================================

interface StepRendererProps {
  children: ReactElement<StepProps>[];
}

function StepRenderer({ children }: StepRendererProps) {
  const { currentStep } = useStepContext();

  return (
    <>
      {Children.map(children, (child, index) => {
        if (index !== currentStep) return null;
        return child;
      })}
    </>
  );
}

// ============================================================================
// MultiStepForm
// ============================================================================

/**
 * Multi-step form 컴포넌트
 *
 * react-hook-form + zod 기반의 타입 안전한 multi-step form을 제공합니다.
 * Step별 부분 검증과 복합 Step(여러 controlled component 조합)을 지원합니다.
 *
 * @template T - 폼 데이터 타입 (Zod 스키마에서 추론)
 *
 * @example
 * ```tsx
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { z } from 'zod';
 * import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';
 * import { useMultiStepForm } from '@/shared/ui/multi-step-form/useMultiStepForm';
 *
 * const schema = z.object({
 *   nickname: z.string().min(2, '2자 이상 입력하세요'),
 *   plan: z.enum(['free', 'pro']),
 *   startDate: z.date(),
 * });
 *
 * type FormData = z.infer<typeof schema>;
 *
 * function MyForm() {
 *   const handleSubmit = (data: FormData) => {
 *     console.log('폼 데이터:', data);
 *   };
 *
 *   return (
 *     <MultiStepForm
 *       resolver={zodResolver(schema)}
 *       defaultValues={{ nickname: '', plan: 'free' }}
 *       onSubmit={handleSubmit}
 *     >
 *       <MultiStepForm.Step fields={['nickname']}>
 *         <NicknameStep />
 *       </MultiStepForm.Step>
 *       <MultiStepForm.Step fields={['plan', 'startDate']}>
 *         <PlanStep />
 *       </MultiStepForm.Step>
 *
 *       <StepNavigation />
 *     </MultiStepForm>
 *   );
 * }
 *
 * function StepNavigation() {
 *   const { isFirstStep, isLastStep, goToNextStep, goToPrevStep } = useMultiStepForm();
 *
 *   return (
 *     <div className="flex gap-2">
 *       <button type="button" onClick={goToPrevStep} disabled={isFirstStep}>
 *         이전
 *       </button>
 *       {isLastStep ? (
 *         <button type="submit">완료</button>
 *       ) : (
 *         <button type="button" onClick={goToNextStep}>다음</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
function MultiStepForm<T extends FieldValues>({
  resolver,
  defaultValues,
  onSubmit,
  children,
  className,
}: MultiStepFormProps<T>) {
  const methods = useForm<T>({
    resolver,
    defaultValues,
    mode: 'onBlur',
  });

  const childArray = Children.toArray(children);
  const steps: ReactElement<StepProps>[] = [];
  const otherChildren: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (isValidElement(child) && child.type === Step) {
      steps.push(child as ReactElement<StepProps>);
    } else {
      otherChildren.push(child);
    }
  });

  return (
    <FormProvider {...methods}>
      <StepProvider totalSteps={steps.length}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className={cn('flex flex-col', className)}>
          <StepRenderer>{steps}</StepRenderer>
          {otherChildren}
        </form>
      </StepProvider>
    </FormProvider>
  );
}

MultiStepForm.Step = Step;

export { MultiStepForm };
