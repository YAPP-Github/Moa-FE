import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'shared/ui/Buttons/Button',
  component: Button,
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

// Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'XS (24px)',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'SM (28px)',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'MD (32px)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'LG (36px)',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'XL (48px)',
  },
};

// States
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

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="tertiary" disabled>
          Tertiary
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
      </div>
    </div>
  ),
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-end">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
};
