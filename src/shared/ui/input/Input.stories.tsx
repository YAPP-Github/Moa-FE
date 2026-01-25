import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'shared/ui/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
  },
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
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

export const WithError: Story = {
  args: {
    placeholder: '이메일을 입력하세요',
    error: true,
    defaultValue: 'invalid-email',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '입력할 수 없습니다',
    disabled: true,
  },
};

export const Clearable: Story = {
  render: function ClearableInput() {
    const [value, setValue] = useState('삭제 가능한 텍스트');

    return (
      <Input
        placeholder="닉네임을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        clearable
        onClear={() => setValue('')}
      />
    );
  },
};

export const WithCharacterCount: Story = {
  render: function CharacterCountInput() {
    const [value, setValue] = useState('');

    return (
      <Input
        placeholder="닉네임을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={10}
        showCount
      />
    );
  },
};
