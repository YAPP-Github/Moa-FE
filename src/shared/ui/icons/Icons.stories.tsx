import type { Meta, StoryObj } from '@storybook/react';
import IcCaretDown from './IcCaretDown';
import IcCheck from './IcCheck';
import IcDelete from './IcDelete';
import IcInfo from './IcInfo';
import IcMeatball from './IcMeatball';
import IcStar from './IcStar';

const icons = {
  IcCaretDown,
  IcCheck,
  IcDelete,
  IcInfo,
  IcMeatball,
  IcStar,
};

const meta: Meta = {
  title: 'shared/ui/Icons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {Object.entries(icons).map(([name, Icon]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon className="h-6 w-6 text-grey-700" />
          <span className="text-xs text-grey-500">{name}</span>
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
          <span className="w-12 text-sm text-grey-500">{size}px</span>
          <div className="flex gap-4">
            {Object.entries(icons).map(([name, Icon]) => (
              <Icon key={name} className="text-grey-700" style={{ width: size, height: size }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {[
        { name: 'Default', className: 'text-grey-700' },
        { name: 'Primary', className: 'text-blue-500' },
        { name: 'Success', className: 'text-green-500' },
        { name: 'Warning', className: 'text-yellow-500' },
        { name: 'Danger', className: 'text-red-500' },
      ].map(({ name, className }) => (
        <div key={name} className="flex items-center gap-4">
          <span className="w-20 text-sm text-grey-500">{name}</span>
          <div className="flex gap-4">
            {Object.entries(icons).map(([iconName, Icon]) => (
              <Icon key={iconName} className={`h-6 w-6 ${className}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const IndividualIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcCaretDown className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcCaretDown</span>
        <span className="text-xs text-grey-400">드롭다운, 펼치기/접기</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcCheck className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcCheck</span>
        <span className="text-xs text-grey-400">체크, 완료</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcDelete className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcDelete</span>
        <span className="text-xs text-grey-400">삭제, 닫기</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcInfo className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcInfo</span>
        <span className="text-xs text-grey-400">정보, 도움말</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcMeatball className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcMeatball</span>
        <span className="text-xs text-grey-400">더보기 메뉴</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
        <IcStar className="h-8 w-8 text-grey-700" />
        <span className="text-sm font-medium">IcStar</span>
        <span className="text-xs text-grey-400">즐겨찾기, 평점</span>
      </div>
    </div>
  ),
};
