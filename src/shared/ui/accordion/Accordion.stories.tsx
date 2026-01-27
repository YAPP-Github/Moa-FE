import type { Meta, StoryObj } from '@storybook/react';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from './Accordion';

const meta = {
  title: 'shared/ui/Accordion',
  component: AccordionRoot,
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
} satisfies Meta<typeof AccordionRoot>;

export default meta;
type Story = StoryObj<typeof AccordionRoot>;

const itemClassName = 'border-b border-[#E5E8EB] data-[state=open]:bg-[#F9FAFB]';
const headerClassName = 'flex w-full items-center justify-between py-4';
const contentClassName = 'pb-4 text-[#6B7684]';

// Caret 아이콘 컴포넌트
const CaretIcon = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Default: Story = {
  render: () => {
    return (
      <AccordionRoot defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1" className={itemClassName}>
          <AccordionHeader className={headerClassName}>
            <span className="font-medium">섹션 1</span>
            <AccordionTrigger className="rounded p-1 hover:bg-[#F3F4F5] data-[state=open]:rotate-180">
              <CaretIcon />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClassName}>
            첫 번째 섹션의 내용입니다. 아이콘만 클릭해야 열고 닫을 수 있습니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className={itemClassName}>
          <AccordionHeader className={headerClassName}>
            <span className="font-medium">섹션 2</span>
            <AccordionTrigger className="rounded p-1 hover:bg-[#F3F4F5] data-[state=open]:rotate-180">
              <CaretIcon />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClassName}>
            두 번째 섹션의 내용입니다.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className={itemClassName}>
          <AccordionHeader className={headerClassName}>
            <span className="font-medium">섹션 3</span>
            <AccordionTrigger className="rounded p-1 hover:bg-[#F3F4F5] data-[state=open]:rotate-180">
              <CaretIcon />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className={contentClassName}>
            세 번째 섹션의 내용입니다.
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    );
  },
};

export const WithCustomContent: Story = {
  render: () => {
    return (
      <AccordionRoot defaultValue="item-1" className="w-full">
        <AccordionItem
          value="item-1"
          className="mb-2 overflow-hidden rounded-lg border border-[#E5E8EB] data-[state=open]:border-[#3182F6]"
        >
          <AccordionHeader className="flex w-full items-center justify-between bg-[#F9FAFB] px-4 py-3 data-[state=open]:bg-[#E9F2FE]">
            <span className="font-medium data-[state=open]:text-[#3182F6]">요금제 정보</span>
            <AccordionTrigger className="rounded p-1 hover:bg-white/50 data-[state=open]:rotate-180 data-[state=open]:text-[#3182F6]">
              <CaretIcon />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="bg-white px-4 py-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B7684]">기본 요금</span>
                <span className="font-medium">9,900원/월</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7684]">추가 기능</span>
                <span className="font-medium">무료</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E8EB] pt-2">
                <span className="font-medium">총 금액</span>
                <span className="font-bold text-[#3182F6]">9,900원</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="mb-2 overflow-hidden rounded-lg border border-[#E5E8EB] data-[state=open]:border-[#3182F6]"
        >
          <AccordionHeader className="flex w-full items-center justify-between bg-[#F9FAFB] px-4 py-3 data-[state=open]:bg-[#E9F2FE]">
            <span className="font-medium data-[state=open]:text-[#3182F6]">결제 수단</span>
            <AccordionTrigger className="rounded p-1 hover:bg-white/50 data-[state=open]:rotate-180 data-[state=open]:text-[#3182F6]">
              <CaretIcon />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-12 rounded bg-[#F3F4F5]" />
              <div>
                <p className="font-medium">신한카드 ****1234</p>
                <p className="text-sm text-[#6B7684]">매월 15일 자동 결제</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    );
  },
};
