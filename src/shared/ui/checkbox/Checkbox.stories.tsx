import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'shared/ui/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: '이용약관에 동의합니다',
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const CheckedWithLabel: Story = {
  args: {
    label: '마케팅 수신에 동의합니다',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: '비활성화 상태',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: '비활성화 + 체크됨',
  },
};

export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Checkbox
          label={`현재 상태: ${checked ? '체크됨' : '체크 안됨'}`}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <button
          type="button"
          onClick={() => setChecked(!checked)}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          외부에서 토글
        </button>
      </div>
    );
  },
};
