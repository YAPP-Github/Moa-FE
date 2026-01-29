import type { Meta, StoryObj } from '@storybook/react';
import IcGoogle from './IcGoogle';
import IcKakao from './IcKakao';

const logos = {
  IcGoogle,
  IcKakao,
};

const meta: Meta = {
  title: 'shared/ui/Logos',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLogos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {Object.entries(logos).map(([name, Logo]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-xs text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[16, 24, 32, 48].map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-12 text-sm text-gray-500">{size}px</span>
          <div className="flex gap-4">
            {Object.entries(logos).map(([name, Logo]) => (
              <Logo key={name} style={{ width: size, height: size }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const IndividualLogos: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
        <IcGoogle className="h-12 w-12" />
        <span className="text-sm font-medium">IcGoogle</span>
        <span className="text-xs text-gray-400">Google 로그인</span>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
        <IcKakao className="h-12 w-12" />
        <span className="text-sm font-medium">IcKakao</span>
        <span className="text-xs text-gray-400">Kakao 로그인</span>
      </div>
    </div>
  ),
};

export const InButtonContext: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="flex h-12 w-80 items-center justify-center gap-2 rounded-md border bg-white font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <IcGoogle className="h-5 w-5" />
        Google로 계속하기
      </button>
      <button
        type="button"
        className="flex h-12 w-80 items-center justify-center gap-2 rounded-md bg-[#FEE500] font-medium text-[#191919] transition-colors hover:bg-[#FDD835]"
      >
        <IcKakao className="h-5 w-5" />
        카카오로 계속하기
      </button>
    </div>
  ),
};
