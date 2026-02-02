import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

const meta = {
  title: 'shared/ui/DropdownMenu',
  component: DropdownMenuRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenuRoot>;

export default meta;
type Story = StoryObj<typeof DropdownMenuRoot>;

// 공통 스타일 클래스
const contentClassName = 'min-w-[160px] rounded-lg border border-[#E5E8EB] bg-white p-1 shadow-lg';
const itemClassName =
  'px-3 py-2 text-sm text-[#191F28] rounded-md cursor-pointer transition-colors hover:bg-[#F9FAFB] data-[highlighted]:bg-[#F9FAFB] data-[disabled]:text-[#A0A9B7] data-[disabled]:cursor-not-allowed';
const separatorClassName = 'h-px bg-[#E5E8EB] my-1';

export const Default: Story = {
  render: () => {
    return (
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button>메뉴 열기</Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className={contentClassName}>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('새 탭 열기')}>
              새 탭 열기
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('새 창 열기')}>
              새 창 열기
            </DropdownMenuItem>
            <DropdownMenuSeparator className={separatorClassName} />
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('설정')}>
              설정
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    );
  },
};

export const WithMeatballIcon: Story = {
  name: 'With Meatball Icon (Sidebar 사용 예시)',
  render: () => {
    return (
      <div className="flex items-center justify-between w-[196px] h-[38px] px-4 py-2 bg-white border border-[#E5E8EB] rounded-lg">
        <span className="text-sm font-medium text-[#191F28]">팀 목록</span>
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <IconButton variant="ghost" size="xs" aria-label="팀 메뉴">
              <IcMeatball className="w-6 h-6" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className={contentClassName} align="end">
              <DropdownMenuItem className={itemClassName} onSelect={() => console.log('팀 추가')}>
                팀 추가
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClassName} onSelect={() => console.log('팀 편집')}>
                팀 편집
              </DropdownMenuItem>
              <DropdownMenuSeparator className={separatorClassName} />
              <DropdownMenuItem
                className={`${itemClassName} text-red-500 hover:text-red-600`}
                onSelect={() => console.log('팀 삭제')}
              >
                팀 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    );
  },
};

export const WithDisabledItem: Story = {
  name: 'With Disabled Item',
  render: () => {
    return (
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button>메뉴 열기</Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className={contentClassName}>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('복사')}>
              복사
            </DropdownMenuItem>
            <DropdownMenuItem
              className={itemClassName}
              onSelect={() => console.log('붙여넣기')}
              disabled
            >
              붙여넣기 (비활성화)
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('삭제')}>
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    );
  },
};

export const AlignmentVariants: Story = {
  name: 'Alignment Variants (start, center, end)',
  render: () => {
    return (
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#6B7684]">align="start"</span>
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary">Start</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className={contentClassName} align="start">
                <DropdownMenuItem className={itemClassName}>항목 1</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 2</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#6B7684]">align="center"</span>
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary">Center</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className={contentClassName} align="center">
                <DropdownMenuItem className={itemClassName}>항목 1</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 2</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#6B7684]">align="end"</span>
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary">End</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className={contentClassName} align="end">
                <DropdownMenuItem className={itemClassName}>항목 1</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 2</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </div>
    );
  },
};

export const SideVariants: Story = {
  name: 'Side Variants (top, bottom)',
  render: () => {
    return (
      <div className="flex gap-8 pt-40">
        <div className="flex flex-col items-center gap-2">
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary">Top</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className={contentClassName} side="top">
                <DropdownMenuItem className={itemClassName}>항목 1</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 2</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
          <span className="text-xs text-[#6B7684]">side="top"</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Button variant="tertiary">Bottom</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className={contentClassName} side="bottom">
                <DropdownMenuItem className={itemClassName}>항목 1</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 2</DropdownMenuItem>
                <DropdownMenuItem className={itemClassName}>항목 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
          <span className="text-xs text-[#6B7684]">side="bottom" (기본값)</span>
        </div>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#6B7684]">현재 상태: {open ? '열림' : '닫힘'}</p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>외부에서 열기</Button>
          <Button variant="tertiary" onClick={() => setOpen(false)}>
            외부에서 닫기
          </Button>
        </div>

        <DropdownMenuRoot open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Button variant="secondary">Controlled Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className={contentClassName}>
              <DropdownMenuItem className={itemClassName}>외부 상태로 제어됩니다</DropdownMenuItem>
              <DropdownMenuItem className={itemClassName}>
                open, onOpenChange props 사용
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  name: 'Keyboard Navigation',
  render: () => {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-[#6B7684] text-center">
          <p>키보드 네비게이션 테스트:</p>
          <ul className="text-xs mt-2 space-y-1">
            <li>• ArrowDown/ArrowUp: 아이템 탐색</li>
            <li>• Enter/Space: 아이템 선택</li>
            <li>• Escape: 메뉴 닫기</li>
            <li>• Home/End: 처음/마지막 아이템</li>
          </ul>
        </div>
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Button>키보드로 열기 (Enter/Space/ArrowDown)</Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className={contentClassName}>
              <DropdownMenuItem className={itemClassName} onSelect={() => alert('항목 1 선택됨')}>
                항목 1
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClassName} onSelect={() => alert('항목 2 선택됨')}>
                항목 2
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClassName} disabled>
                항목 3 (비활성화 - 건너뜀)
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClassName} onSelect={() => alert('항목 4 선택됨')}>
                항목 4
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    );
  },
};

export const WithDangerItem: Story = {
  name: 'With Danger Item (삭제 등)',
  render: () => {
    return (
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button>작업 메뉴</Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className={contentClassName}>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('수정')}>
              수정
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClassName} onSelect={() => console.log('복제')}>
              복제
            </DropdownMenuItem>
            <DropdownMenuSeparator className={separatorClassName} />
            <DropdownMenuItem
              className={`${itemClassName} text-[#FF5959] hover:bg-red-50 data-[highlighted]:bg-red-50`}
              onSelect={() => console.log('삭제')}
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    );
  },
};
