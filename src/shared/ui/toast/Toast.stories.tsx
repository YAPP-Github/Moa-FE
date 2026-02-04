import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer, useToast } from './Toast';
import { Button } from '@/shared/ui/button/Button';

const meta: Meta<typeof ToastContainer> = {
  title: 'shared/ui/Toast',
  component: ToastContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Success: Story = {
  render: function SuccessStory() {
    const { showToast } = useToast();

    return (
      <Button onClick={() => showToast({ variant: 'success', message: '팀 생성이 완료되었어요!' })}>
        Success 토스트 보기
      </Button>
    );
  },
};

export const Warning: Story = {
  render: function WarningStory() {
    const { showToast } = useToast();

    return (
      <Button
        onClick={() =>
          showToast({
            variant: 'warning',
            message: '저장되지 않은 변경사항이 있어요!',
          })
        }
      >
        Warning 토스트 보기
      </Button>
    );
  },
};

// ============================================================================
// Stack Demo
// ============================================================================

export const StackDemo: Story = {
  render: function StackDemoStory() {
    const { showToast } = useToast();

    const showMultiple = () => {
      showToast({ variant: 'success', message: '첫 번째 토스트' });
      setTimeout(() => {
        showToast({ variant: 'warning', message: '두 번째 토스트' });
      }, 300);
      setTimeout(() => {
        showToast({ variant: 'success', message: '세 번째 토스트' });
      }, 600);
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={showMultiple}>여러 토스트 동시에 보기</Button>
        <p className="text-sm text-grey-600">클릭하면 3개의 토스트가 순차적으로 쌓입니다</p>
      </div>
    );
  },
};

// ============================================================================
// Interactive
// ============================================================================

export const Interactive: Story = {
  render: function InteractiveStory() {
    const { showToast } = useToast();

    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => showToast({ variant: 'success', message: '작업이 완료되었습니다!' })}
        >
          Success
        </Button>
        <Button
          variant="tertiary"
          onClick={() => showToast({ variant: 'warning', message: '주의가 필요합니다!' })}
        >
          Warning
        </Button>
      </div>
    );
  },
};

// ============================================================================
// Custom Duration
// ============================================================================

export const CustomDuration: Story = {
  render: function CustomDurationStory() {
    const { showToast } = useToast();

    return (
      <Button
        onClick={() =>
          showToast({
            variant: 'success',
            message: '이 토스트는 5초 후에 사라집니다.',
            duration: 5000,
          })
        }
      >
        5초 동안 표시
      </Button>
    );
  },
};
