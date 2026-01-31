import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'shared/ui/Buttons/IconButton',
  component: IconButton,
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
    shape: {
      control: 'select',
      options: ['square', 'circle'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample icon for stories
const PlusIcon = () => (
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
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CloseIcon = () => (
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
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: <PlusIcon />,
    'aria-label': '추가',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: <PlusIcon />,
    'aria-label': '추가',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: <PlusIcon />,
    'aria-label': '추가',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: <CloseIcon />,
    'aria-label': '닫기',
  },
};

// Shapes
export const Square: Story = {
  args: {
    shape: 'square',
    children: <PlusIcon />,
    'aria-label': '추가',
  },
};

export const Circle: Story = {
  args: {
    shape: 'circle',
    children: <PlusIcon />,
    'aria-label': '추가',
  },
};

// Sizes
export const AllSizesSquare: Story = {
  render: () => (
    <div className="flex gap-2 items-end">
      <IconButton size="xs" aria-label="XS">
        <PlusIcon />
      </IconButton>
      <IconButton size="sm" aria-label="SM">
        <PlusIcon />
      </IconButton>
      <IconButton size="md" aria-label="MD">
        <PlusIcon />
      </IconButton>
      <IconButton size="lg" aria-label="LG">
        <PlusIcon />
      </IconButton>
      <IconButton size="xl" aria-label="XL">
        <PlusIcon />
      </IconButton>
    </div>
  ),
};

export const AllSizesCircle: Story = {
  render: () => (
    <div className="flex gap-2 items-end">
      <IconButton size="xs" shape="circle" aria-label="XS">
        <PlusIcon />
      </IconButton>
      <IconButton size="sm" shape="circle" aria-label="SM">
        <PlusIcon />
      </IconButton>
      <IconButton size="md" shape="circle" aria-label="MD">
        <PlusIcon />
      </IconButton>
      <IconButton size="lg" shape="circle" aria-label="LG">
        <PlusIcon />
      </IconButton>
      <IconButton size="xl" shape="circle" aria-label="XL">
        <PlusIcon />
      </IconButton>
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <span className="w-16 text-sm">Square:</span>
        <IconButton variant="primary" aria-label="Primary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="secondary" aria-label="Secondary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="tertiary" aria-label="Tertiary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="ghost" aria-label="Ghost">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="flex gap-2 items-center">
        <span className="w-16 text-sm">Circle:</span>
        <IconButton variant="primary" shape="circle" aria-label="Primary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="secondary" shape="circle" aria-label="Secondary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="tertiary" shape="circle" aria-label="Tertiary">
          <PlusIcon />
        </IconButton>
        <IconButton variant="ghost" shape="circle" aria-label="Ghost">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  ),
};

// Disabled State
export const Disabled: Story = {
  args: {
    disabled: true,
    children: <PlusIcon />,
    'aria-label': '비활성화',
  },
};
