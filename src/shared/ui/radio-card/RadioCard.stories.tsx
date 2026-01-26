import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioCardGroup, RadioCardItem } from './RadioCard';

const meta: Meta<typeof RadioCardGroup> = {
  title: 'shared/ui/RadioCard',
  component: RadioCardGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioCardGroup value={value} onValueChange={setValue} className="flex flex-col gap-3">
        <RadioCardItem
          value="option1"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 1
        </RadioCardItem>
        <RadioCardItem
          value="option2"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 2
        </RadioCardItem>
        <RadioCardItem
          value="option3"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 3
        </RadioCardItem>
      </RadioCardGroup>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('monthly');

    return (
      <RadioCardGroup value={value} onValueChange={setValue} className="flex flex-row gap-3">
        <RadioCardItem
          value="monthly"
          className="flex-1 rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">월간</span>
            <span className="text-sm text-[#6B7684]">9,900원/월</span>
          </div>
        </RadioCardItem>
        <RadioCardItem
          value="yearly"
          className="flex-1 rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">연간</span>
            <span className="text-sm text-[#6B7684]">99,000원/년</span>
          </div>
        </RadioCardItem>
      </RadioCardGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioCardGroup value={value} onValueChange={setValue} className="flex flex-col gap-3">
        <RadioCardItem
          value="option1"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          활성화된 옵션
        </RadioCardItem>
        <RadioCardItem
          value="option2"
          disabled
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          비활성화된 옵션
        </RadioCardItem>
        <RadioCardItem
          value="option3"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          활성화된 옵션
        </RadioCardItem>
      </RadioCardGroup>
    );
  },
};

export const GroupDisabled: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioCardGroup
        value={value}
        onValueChange={setValue}
        disabled
        className="flex flex-col gap-3"
      >
        <RadioCardItem
          value="option1"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 1
        </RadioCardItem>
        <RadioCardItem
          value="option2"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 2
        </RadioCardItem>
        <RadioCardItem
          value="option3"
          className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#1C1C1C]"
        >
          옵션 3
        </RadioCardItem>
      </RadioCardGroup>
    );
  },
};
