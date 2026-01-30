import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller, useFormContext } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { MultiStepForm } from './MultiStepForm';
import { useMultiStepForm } from './useMultiStepForm';

// ============================================================================
// Test Schema & Components
// ============================================================================

const testSchema = z.object({
  step1Field: z.string().min(1, '필수 입력입니다'),
  step2Field: z.string().min(1, '필수 입력입니다'),
});

type TestFormData = z.infer<typeof testSchema>;

function Step1Content() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TestFormData>();

  return (
    <div>
      <label htmlFor="step1Field">Step 1 필드</label>
      <input id="step1Field" {...register('step1Field')} />
      {errors.step1Field && <span role="alert">{errors.step1Field.message}</span>}
    </div>
  );
}

function Step2Content() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TestFormData>();

  return (
    <div>
      <label htmlFor="step2Field">Step 2 필드</label>
      <input id="step2Field" {...register('step2Field')} />
      {errors.step2Field && <span role="alert">{errors.step2Field.message}</span>}
    </div>
  );
}

function StepNavigation() {
  const { isFirstStep, isLastStep, goToNextStep, goToPrevStep, currentStep } = useMultiStepForm();

  return (
    <div>
      <span data-testid="current-step">{currentStep}</span>
      <button type="button" onClick={goToPrevStep} disabled={isFirstStep}>
        이전
      </button>
      {isLastStep ? (
        <button type="submit">완료</button>
      ) : (
        <button type="button" onClick={goToNextStep}>
          다음
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Tests
// ============================================================================

describe('MultiStepForm', () => {
  it('첫 번째 Step을 렌더링한다', () => {
    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    expect(screen.getByLabelText('Step 1 필드')).toBeInTheDocument();
    expect(screen.queryByLabelText('Step 2 필드')).not.toBeInTheDocument();
  });

  it('currentStep이 0부터 시작한다', () => {
    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    expect(screen.getByTestId('current-step')).toHaveTextContent('0');
  });

  it('유효한 필드로 다음 Step으로 이동한다', async () => {
    const user = userEvent.setup();

    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    // Step 1 입력
    await user.type(screen.getByLabelText('Step 1 필드'), '테스트');

    // 다음 버튼 클릭
    await user.click(screen.getByRole('button', { name: '다음' }));

    // Step 2로 이동 확인
    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });
    expect(screen.getByLabelText('Step 2 필드')).toBeInTheDocument();
  });

  it('유효하지 않은 필드로 이동하지 않고 에러를 표시한다', async () => {
    const user = userEvent.setup();

    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    // 빈 상태로 다음 버튼 클릭
    await user.click(screen.getByRole('button', { name: '다음' }));

    // 에러 메시지 표시 확인
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('필수 입력입니다');
    });

    // Step이 이동하지 않음
    expect(screen.getByTestId('current-step')).toHaveTextContent('0');
  });

  it('이전 버튼으로 이전 Step으로 이동한다', async () => {
    const user = userEvent.setup();

    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    // Step 1 입력 후 다음
    await user.type(screen.getByLabelText('Step 1 필드'), '테스트');
    await user.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });

    // 이전 버튼 클릭
    await user.click(screen.getByRole('button', { name: '이전' }));

    // Step 0으로 돌아감
    expect(screen.getByTestId('current-step')).toHaveTextContent('0');
    expect(screen.getByLabelText('Step 1 필드')).toBeInTheDocument();
  });

  it('첫 Step에서 이전 버튼이 비활성화된다', () => {
    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
  });

  it('마지막 Step에서 완료 버튼을 표시한다', async () => {
    const user = userEvent.setup();

    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={vi.fn()}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    // Step 1 완료
    await user.type(screen.getByLabelText('Step 1 필드'), '테스트');
    await user.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '완료' })).toBeInTheDocument();
    });
  });

  it('완료 버튼 클릭 시 onSubmit이 호출된다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MultiStepForm<TestFormData>
        resolver={zodResolver(testSchema)}
        defaultValues={{ step1Field: '', step2Field: '' }}
        onSubmit={onSubmit}
      >
        <MultiStepForm.Step fields={['step1Field']}>
          <Step1Content />
        </MultiStepForm.Step>
        <MultiStepForm.Step fields={['step2Field']}>
          <Step2Content />
        </MultiStepForm.Step>
        <StepNavigation />
      </MultiStepForm>
    );

    // Step 1 완료
    await user.type(screen.getByLabelText('Step 1 필드'), '값1');
    await user.click(screen.getByRole('button', { name: '다음' }));

    // Step 2 완료
    await waitFor(() => {
      expect(screen.getByLabelText('Step 2 필드')).toBeInTheDocument();
    });
    await user.type(screen.getByLabelText('Step 2 필드'), '값2');
    await user.click(screen.getByRole('button', { name: '완료' }));

    // onSubmit 호출 확인
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { step1Field: '값1', step2Field: '값2' },
        expect.anything()
      );
    });
  });
});

// ============================================================================
// Complex Field Tests
// ============================================================================

describe('MultiStepForm - 복합 필드', () => {
  const complexSchema = z.object({
    selection: z.enum(['a', 'b'], { message: '선택하세요' }),
  });

  type ComplexFormData = z.infer<typeof complexSchema>;

  function SelectionStep() {
    const { control } = useFormContext<ComplexFormData>();

    return (
      <Controller
        name="selection"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <select value={field.value || ''} onChange={field.onChange} aria-label="선택">
              <option value="">선택하세요</option>
              <option value="a">옵션 A</option>
              <option value="b">옵션 B</option>
            </select>
            {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
          </div>
        )}
      />
    );
  }

  it('Controller를 사용한 복합 필드가 동작한다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MultiStepForm<ComplexFormData>
        resolver={zodResolver(complexSchema)}
        defaultValues={{}}
        onSubmit={onSubmit}
      >
        <MultiStepForm.Step fields={['selection']}>
          <SelectionStep />
        </MultiStepForm.Step>
        <button type="submit">완료</button>
      </MultiStepForm>
    );

    // 선택
    await user.selectOptions(screen.getByRole('combobox'), 'a');
    await user.click(screen.getByRole('button', { name: '완료' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ selection: 'a' }, expect.anything());
    });
  });
});
