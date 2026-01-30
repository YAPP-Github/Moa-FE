import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta } from '@storybook/react';
import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { MultiStepForm } from './MultiStepForm';
import { useMultiStepForm } from './useMultiStepForm';
import { Button } from '@/shared/ui/button/Button';
import { Calendar } from '@/shared/ui/calendar/Calendar';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

const meta: Meta = {
  title: 'Shared/MultiStepForm',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// ============================================================================
// Basic Example
// ============================================================================

const basicSchema = z.object({
  nickname: z.string().min(2, '2자 이상 입력하세요'),
  email: z.string().email('올바른 이메일을 입력하세요'),
});

type BasicFormData = z.infer<typeof basicSchema>;

function BasicStepNavigation() {
  const { isFirstStep, isLastStep, goToNextStep, goToPrevStep, currentStep, totalSteps } =
    useMultiStepForm();

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <Button type="button" variant="ghost" onClick={goToPrevStep} disabled={isFirstStep}>
        이전
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>
      {isLastStep ? (
        <Button type="submit">완료</Button>
      ) : (
        <Button type="button" onClick={goToNextStep}>
          다음
        </Button>
      )}
    </div>
  );
}

function NicknameStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicFormData>();

  return (
    <Field>
      <FieldLabel required>닉네임</FieldLabel>
      <Input
        {...register('nickname')}
        placeholder="닉네임을 입력하세요"
        error={!!errors.nickname}
      />
      <FieldError>{errors.nickname?.message}</FieldError>
    </Field>
  );
}

function EmailStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicFormData>();

  return (
    <Field>
      <FieldLabel required>이메일</FieldLabel>
      <Input
        {...register('email')}
        type="email"
        placeholder="이메일을 입력하세요"
        error={!!errors.email}
      />
      <FieldError>{errors.email?.message}</FieldError>
    </Field>
  );
}

export function Basic() {
  return (
    <div className="w-[400px] p-6 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">기본 Multi-step Form</h2>
      <MultiStepForm<BasicFormData>
        resolver={zodResolver(basicSchema)}
        defaultValues={{ nickname: '', email: '' }}
        onSubmit={(data) => {
          alert(`제출 완료!\n닉네임: ${data.nickname}\n이메일: ${data.email}`);
        }}
      >
        <MultiStepForm.Step fields={['nickname']}>
          <NicknameStep />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['email']}>
          <EmailStep />
        </MultiStepForm.Step>

        <BasicStepNavigation />
      </MultiStepForm>
    </div>
  );
}

// ============================================================================
// Complex Example (RadioCard + Calendar)
// ============================================================================

const complexSchema = z.object({
  nickname: z.string().min(2, '2자 이상 입력하세요'),
  plan: z.enum(['free', 'pro', 'enterprise'], {
    message: '요금제를 선택하세요',
  }),
  startDate: z.date({
    message: '시작일을 선택하세요',
  }),
});

type ComplexFormData = z.infer<typeof complexSchema>;

function PlanSelectionStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ComplexFormData>();

  return (
    <div className="space-y-6">
      {/* RadioCard 필드 */}
      <Field>
        <FieldLabel required>요금제 선택</FieldLabel>
        <Controller
          name="plan"
          control={control}
          render={({ field }) => (
            <RadioCardGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col gap-3 mt-2"
            >
              <RadioCardItem
                value="free"
                className="flex flex-col gap-1 p-4 rounded-lg border-2 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50 data-[state=unchecked]:border-gray-200"
              >
                <span className="font-medium">무료</span>
                <span className="text-sm text-muted-foreground">기본 기능 사용 가능</span>
              </RadioCardItem>
              <RadioCardItem
                value="pro"
                className="flex flex-col gap-1 p-4 rounded-lg border-2 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50 data-[state=unchecked]:border-gray-200"
              >
                <span className="font-medium">프로</span>
                <span className="text-sm text-muted-foreground">모든 기능 사용 가능</span>
              </RadioCardItem>
              <RadioCardItem
                value="enterprise"
                className="flex flex-col gap-1 p-4 rounded-lg border-2 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50 data-[state=unchecked]:border-gray-200"
              >
                <span className="font-medium">엔터프라이즈</span>
                <span className="text-sm text-muted-foreground">팀 기능 + 우선 지원</span>
              </RadioCardItem>
            </RadioCardGroup>
          )}
        />
        <FieldError>{errors.plan?.message}</FieldError>
      </Field>

      {/* Calendar 필드 */}
      <Field>
        <FieldLabel required>시작일</FieldLabel>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <div className="border rounded-lg mt-2">
              <Calendar
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
              />
            </div>
          )}
        />
        <FieldError>{errors.startDate?.message}</FieldError>
      </Field>
    </div>
  );
}

function ComplexStepNavigation() {
  const { isFirstStep, isLastStep, goToNextStep, goToPrevStep, currentStep, totalSteps } =
    useMultiStepForm();

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <Button type="button" variant="ghost" onClick={goToPrevStep} disabled={isFirstStep}>
        이전
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>
      {isLastStep ? (
        <Button type="submit">완료</Button>
      ) : (
        <Button type="button" onClick={goToNextStep}>
          다음
        </Button>
      )}
    </div>
  );
}

export function ComplexWithRadioCardAndCalendar() {
  return (
    <div className="w-[400px] p-6 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">복합 Step (RadioCard + Calendar)</h2>
      <MultiStepForm<ComplexFormData>
        resolver={zodResolver(complexSchema)}
        defaultValues={{ nickname: '' }}
        onSubmit={(data) => {
          alert(
            `제출 완료!\n닉네임: ${data.nickname}\n요금제: ${
              data.plan
            }\n시작일: ${data.startDate.toLocaleDateString()}`
          );
        }}
      >
        <MultiStepForm.Step fields={['nickname']}>
          <Field>
            <FieldLabel required>닉네임</FieldLabel>
            <Controller
              name="nickname"
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="닉네임을 입력하세요" error={!!fieldState.error} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </>
              )}
            />
          </Field>
        </MultiStepForm.Step>

        <MultiStepForm.Step fields={['plan', 'startDate']}>
          <PlanSelectionStep />
        </MultiStepForm.Step>

        <ComplexStepNavigation />
      </MultiStepForm>
    </div>
  );
}

// ============================================================================
// Three Steps Example
// ============================================================================

const threeStepSchema = z.object({
  step1Field: z.string().min(1, '필수 입력입니다'),
  step2Field: z.string().min(1, '필수 입력입니다'),
  step3Field: z.string().min(1, '필수 입력입니다'),
});

type ThreeStepFormData = z.infer<typeof threeStepSchema>;

const STEP_KEYS = ['step-0', 'step-1', 'step-2'] as const;

function StepIndicator({ stepIndex, isActive }: { stepIndex: number; isActive: boolean }) {
  return (
    <div
      key={STEP_KEYS[stepIndex]}
      className={`w-2 h-2 rounded-full transition-colors ${
        isActive ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    />
  );
}

function ThreeStepNavigation() {
  const { isFirstStep, isLastStep, goToNextStep, goToPrevStep, currentStep, totalSteps } =
    useMultiStepForm();

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <Button type="button" variant="ghost" onClick={goToPrevStep} disabled={isFirstStep}>
        이전
      </Button>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <StepIndicator key={STEP_KEYS[i]} stepIndex={i} isActive={i === currentStep} />
        ))}
      </div>
      {isLastStep ? (
        <Button type="submit">완료</Button>
      ) : (
        <Button type="button" onClick={goToNextStep}>
          다음
        </Button>
      )}
    </div>
  );
}

export function ThreeSteps() {
  return (
    <div className="w-[400px] p-6 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">3단계 Form</h2>
      <MultiStepForm<ThreeStepFormData>
        resolver={zodResolver(threeStepSchema)}
        defaultValues={{ step1Field: '', step2Field: '', step3Field: '' }}
        onSubmit={(data) => {
          alert(JSON.stringify(data, null, 2));
        }}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Field>
            <FieldLabel required>Step 1 필드</FieldLabel>
            <Controller
              name="step1Field"
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Step 1 입력" error={!!fieldState.error} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </>
              )}
            />
          </Field>
        </MultiStepForm.Step>

        <MultiStepForm.Step fields={['step2Field']}>
          <Field>
            <FieldLabel required>Step 2 필드</FieldLabel>
            <Controller
              name="step2Field"
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Step 2 입력" error={!!fieldState.error} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </>
              )}
            />
          </Field>
        </MultiStepForm.Step>

        <MultiStepForm.Step fields={['step3Field']}>
          <Field>
            <FieldLabel required>Step 3 필드</FieldLabel>
            <Controller
              name="step3Field"
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Step 3 입력" error={!!fieldState.error} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </>
              )}
            />
          </Field>
        </MultiStepForm.Step>

        <ThreeStepNavigation />
      </MultiStepForm>
    </div>
  );
}
