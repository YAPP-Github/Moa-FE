import type { Meta, StoryObj } from '@storybook/react';
import { SwiperContent, SwiperItem, SwiperRoot } from './Swiper';

const meta = {
  title: 'shared/ui/Swiper',
  component: SwiperRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwiperRoot>;

export default meta;
type Story = StoryObj<typeof SwiperRoot>;

const Card = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div
    className="flex h-[150px] w-[200px] items-center justify-center rounded-xl text-white font-medium text-lg"
    style={{ backgroundColor: color }}
  >
    {children}
  </div>
);

const COLORS = [
  '#3182F6', // Blue
  '#00C853', // Green
  '#FF6B6B', // Red
  '#FFB300', // Yellow
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FF5722', // Orange
  '#607D8B', // Gray
];

export const Default: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="mb-4 text-sm text-[#6B7684]">마우스로 드래그하여 스크롤하세요.</p>
      <SwiperRoot>
        <SwiperContent className="gap-4">
          {COLORS.map((color, index) => (
            <SwiperItem key={color}>
              <Card color={color}>Item {index + 1}</Card>
            </SwiperItem>
          ))}
        </SwiperContent>
      </SwiperRoot>
    </div>
  ),
};

// ============================================================================
// With Inset (Content Inset / Edge Padding)
// ============================================================================

export const WithInset: Story = {
  render: () => (
    <div className="w-[500px] bg-[#F3F4F5] rounded-xl">
      <p className="px-4 pt-4 pb-2 text-sm text-[#6B7684]">
        inset=16: 좌우에 16px 여백이 생깁니다. 끝까지 스크롤하면 여백이 보입니다.
      </p>
      <SwiperRoot>
        <SwiperContent className="gap-4 py-4" inset={16}>
          {COLORS.map((color, index) => (
            <SwiperItem key={color}>
              <Card color={color}>Item {index + 1}</Card>
            </SwiperItem>
          ))}
        </SwiperContent>
      </SwiperRoot>
    </div>
  ),
};

// ============================================================================
// With Links (Tab Navigation)
// ============================================================================

export const WithLinks: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="mb-4 text-sm text-[#6B7684]">
        Tab 키로 링크에 포커스를 이동하면 해당 카드가 보이도록 스크롤됩니다.
      </p>
      <SwiperRoot>
        <SwiperContent className="gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SwiperItem key={i}>
              <div className="w-[180px] rounded-xl border border-[#E5E8EB] bg-white p-4 shadow-sm">
                <div className="mb-3 h-[100px] rounded-lg bg-[#F3F4F5]" />
                <p className="font-medium mb-2">Product {i}</p>
                <a
                  href={`#product-${i}`}
                  className="text-sm text-[#3182F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:ring-offset-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Navigate to Product ${i}`);
                  }}
                >
                  View details →
                </a>
              </div>
            </SwiperItem>
          ))}
        </SwiperContent>
      </SwiperRoot>
    </div>
  ),
};
