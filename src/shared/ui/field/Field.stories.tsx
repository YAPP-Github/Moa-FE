import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription, FieldError, FieldLabel } from './Field';
import { Input } from '../input/Input';

const meta: Meta<typeof Field> = {
  title: 'shared/ui/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '368px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="default-input">이메일</FieldLabel>
      <Input id="default-input" placeholder="이메일을 입력하세요" />
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="required-input" required>
        이메일
      </FieldLabel>
      <Input id="required-input" placeholder="이메일을 입력하세요" />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="desc-input" required>
        비밀번호
      </FieldLabel>
      <Input
        id="desc-input"
        type="password"
        placeholder="비밀번호를 입력하세요"
        aria-describedby="desc-input-description"
      />
      <FieldDescription id="desc-input-description">
        8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
      </FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="error-input" required>
        이메일
      </FieldLabel>
      <Input
        id="error-input"
        placeholder="이메일을 입력하세요"
        defaultValue="invalid-email"
        error
        aria-invalid
        aria-describedby="error-input-error"
      />
      <FieldError id="error-input-error">올바른 이메일 형식이 아닙니다.</FieldError>
    </Field>
  ),
};
