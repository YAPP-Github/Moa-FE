import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToggleButton } from './ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'shared/ui/Buttons/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    pressed: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic
export const Default: Story = {
  args: {
    children: 'Toggle',
  },
};

// Variants - Not Pressed
export const PrimaryNotPressed: Story = {
  args: {
    variant: 'primary',
    pressed: false,
    children: 'Primary',
  },
};

export const PrimaryPressed: Story = {
  args: {
    variant: 'primary',
    pressed: true,
    children: 'Primary',
  },
};

export const SecondaryNotPressed: Story = {
  args: {
    variant: 'secondary',
    pressed: false,
    children: 'Secondary',
  },
};

export const SecondaryPressed: Story = {
  args: {
    variant: 'secondary',
    pressed: true,
    children: 'Secondary',
  },
};

export const TertiaryNotPressed: Story = {
  args: {
    variant: 'tertiary',
    pressed: false,
    children: 'Tertiary',
  },
};

export const TertiaryPressed: Story = {
  args: {
    variant: 'tertiary',
    pressed: true,
    children: 'Tertiary',
  },
};

export const GhostNotPressed: Story = {
  args: {
    variant: 'ghost',
    pressed: false,
    children: 'Ghost',
  },
};

export const GhostPressed: Story = {
  args: {
    variant: 'ghost',
    pressed: true,
    children: 'Ghost',
  },
};

// Interactive Example
const InteractiveToggle = () => {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleButton pressed={pressed} onPressedChange={setPressed}>
        {pressed ? 'ON' : 'OFF'}
      </ToggleButton>
      <span className="text-sm text-grey-500">State: {pressed ? 'Pressed' : 'Not Pressed'}</span>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveToggle />,
};

// All Variants Comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <span className="w-24 text-sm">Not Pressed:</span>
        <ToggleButton variant="primary" pressed={false}>
          Primary
        </ToggleButton>
        <ToggleButton variant="secondary" pressed={false}>
          Secondary
        </ToggleButton>
        <ToggleButton variant="tertiary" pressed={false}>
          Tertiary
        </ToggleButton>
        <ToggleButton variant="ghost" pressed={false}>
          Ghost
        </ToggleButton>
      </div>
      <div className="flex gap-2 items-center">
        <span className="w-24 text-sm">Pressed:</span>
        <ToggleButton variant="primary" pressed={true}>
          Primary
        </ToggleButton>
        <ToggleButton variant="secondary" pressed={true}>
          Secondary
        </ToggleButton>
        <ToggleButton variant="tertiary" pressed={true}>
          Tertiary
        </ToggleButton>
        <ToggleButton variant="ghost" pressed={true}>
          Ghost
        </ToggleButton>
      </div>
    </div>
  ),
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-end">
      <ToggleButton size="xs">XS</ToggleButton>
      <ToggleButton size="sm">SM</ToggleButton>
      <ToggleButton size="md">MD</ToggleButton>
      <ToggleButton size="lg">LG</ToggleButton>
      <ToggleButton size="xl">XL</ToggleButton>
    </div>
  ),
};

// Uncontrolled (uses internal state)
export const Uncontrolled: Story = {
  args: {
    defaultPressed: false,
    children: 'Click me',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// Toggle Group Example
const ToggleGroupExample = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex gap-2">
      {['Option 1', 'Option 2', 'Option 3'].map((option) => (
        <ToggleButton
          key={option}
          variant="secondary"
          pressed={selected === option}
          onPressedChange={() => setSelected(option)}
        >
          {option}
        </ToggleButton>
      ))}
    </div>
  );
};

export const ToggleGroup: Story = {
  render: () => <ToggleGroupExample />,
};
