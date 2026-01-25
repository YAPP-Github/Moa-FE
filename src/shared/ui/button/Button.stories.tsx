import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '시작하기',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '취소',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: '확인',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: '다음',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: '제출하기',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: '회원가입',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: (
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    ),
    'aria-label': '위로',
  },
};

export const RoundedButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button className="rounded-full">시작하기</Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </Button>
    </div>
  ),
};
