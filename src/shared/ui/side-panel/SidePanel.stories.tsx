import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SidePanel } from './SidePanel';
import { Button } from '@/shared/ui/button/Button';

const meta: Meta<typeof SidePanel> = {
  title: 'shared/ui/SidePanel',
  component: SidePanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: function DefaultStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>사이드 패널 열기</Button>

        <SidePanel open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex h-full flex-col">
            <header className="border-b border-grey-200 p-4">
              <h2 className="text-lg font-semibold">사이드 패널</h2>
            </header>
            <div className="flex-1 p-4">
              <p>패널 내용이 여기에 들어갑니다.</p>
            </div>
          </div>
        </SidePanel>
      </div>
    );
  },
};

export const NoBackdrop: Story = {
  render: function NoBackdropStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>백드롭 없는 패널 열기</Button>
        <p className="mt-4 text-grey-600">백드롭이 없어서 뒤의 콘텐츠와 상호작용 가능합니다.</p>

        <SidePanel open={isOpen} onOpenChange={setIsOpen} showBackdrop={false}>
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-grey-200 p-4">
              <h2 className="text-lg font-semibold">백드롭 없는 패널</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                닫기
              </Button>
            </header>
            <div className="flex-1 p-4">
              <p>ESC 키 또는 닫기 버튼으로 닫을 수 있습니다.</p>
            </div>
          </div>
        </SidePanel>
      </div>
    );
  },
};

export const WithTopOffset: Story = {
  render: function WithTopOffsetStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="min-h-screen">
        {/* Mock Header */}
        <div className="h-[54px] bg-grey-100 border-b border-grey-200 flex items-center px-4">
          <span className="font-semibold">헤더 영역 (54px)</span>
        </div>

        <div className="p-8">
          <Button onClick={() => setIsOpen(true)}>헤더 아래부터 시작하는 패널</Button>

          <SidePanel open={isOpen} onOpenChange={setIsOpen} topOffset="54px" showBackdrop={false}>
            <div className="flex h-full flex-col">
              <header className="flex items-center justify-between border-b border-grey-200 p-4">
                <h2 className="text-lg font-semibold">헤더 아래 패널</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  닫기
                </Button>
              </header>
              <div className="flex-1 p-4">
                <p>이 패널은 상단 54px 헤더 아래부터 시작합니다.</p>
              </div>
            </div>
          </SidePanel>
        </div>
      </div>
    );
  },
};

export const CustomWidth: Story = {
  render: function CustomWidthStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>넓은 패널 열기 (800px)</Button>

        <SidePanel open={isOpen} onOpenChange={setIsOpen} width="800px">
          <div className="flex h-full flex-col">
            <header className="border-b border-grey-200 p-4">
              <h2 className="text-lg font-semibold">넓은 사이드 패널</h2>
            </header>
            <div className="flex-1 p-4">
              <p>800px 너비의 패널입니다.</p>
            </div>
          </div>
        </SidePanel>
      </div>
    );
  },
};
