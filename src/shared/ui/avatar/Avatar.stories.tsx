import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'shared/ui/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 이미지 URL
const sampleImageUrl =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face';

// 기본 (이미지)
export const Default: Story = {
  args: {
    src: sampleImageUrl,
    alt: 'John Doe',
    size: 'md',
  },
};

// 이미지 Avatar
export const WithImage: Story = {
  args: {
    src: sampleImageUrl,
    alt: 'User Avatar',
    size: 'lg',
  },
};

// 이니셜 Fallback (영문)
export const WithInitialsEnglish: Story = {
  args: {
    alt: 'John Doe',
    size: 'lg',
  },
};

// 이니셜 Fallback (한글)
export const WithInitialsKorean: Story = {
  args: {
    alt: '홍길동',
    size: 'lg',
  },
};

// 커스텀 Fallback
export const WithCustomFallback: Story = {
  args: {
    fallback: '🎉',
    size: 'lg',
  },
};

// 빈 Avatar (회색 배경만)
export const Empty: Story = {
  args: {
    size: 'lg',
  },
};

// 이미지 로드 실패 시
export const ImageLoadError: Story = {
  args: {
    src: 'https://invalid-url.com/image.jpg',
    alt: 'Error User',
    size: 'lg',
  },
};

// 모든 크기
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar size="xs" src={sampleImageUrl} alt="XS" />
        <span className="text-xs text-grey-500">xs</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="sm" src={sampleImageUrl} alt="SM" />
        <span className="text-xs text-grey-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="md" src={sampleImageUrl} alt="MD" />
        <span className="text-xs text-grey-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" src={sampleImageUrl} alt="LG" />
        <span className="text-xs text-grey-500">lg</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="xl" src={sampleImageUrl} alt="XL" />
        <span className="text-xs text-grey-500">xl</span>
      </div>
    </div>
  ),
};

// 모든 크기 (이니셜)
export const AllSizesWithInitials: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar size="xs" alt="John Doe" />
        <span className="text-xs text-grey-500">xs</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="sm" alt="John Doe" />
        <span className="text-xs text-grey-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="md" alt="John Doe" />
        <span className="text-xs text-grey-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" alt="John Doe" />
        <span className="text-xs text-grey-500">lg</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="xl" alt="John Doe" />
        <span className="text-xs text-grey-500">xl</span>
      </div>
    </div>
  ),
};

// 다양한 Fallback 유형
export const FallbackVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" src={sampleImageUrl} alt="이미지" />
        <span className="text-xs text-grey-500">이미지</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" alt="John Doe" />
        <span className="text-xs text-grey-500">영문 이니셜</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" alt="홍길동" />
        <span className="text-xs text-grey-500">한글 이니셜</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" fallback="🚀" />
        <span className="text-xs text-grey-500">이모지</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar size="lg" />
        <span className="text-xs text-grey-500">빈 배경</span>
      </div>
    </div>
  ),
};

// 실제 사용 예시 (팀원 목록)
export const TeamMemberList: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar
        size="md"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
        alt="팀원 1"
        className="ring-2 ring-white"
      />
      <Avatar
        size="md"
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
        alt="팀원 2"
        className="ring-2 ring-white"
      />
      <Avatar size="md" alt="김철수" className="ring-2 ring-white" />
      <Avatar size="md" alt="이영희" className="ring-2 ring-white" />
      <Avatar size="md" fallback="+3" className="ring-2 ring-white text-xs" />
    </div>
  ),
};
