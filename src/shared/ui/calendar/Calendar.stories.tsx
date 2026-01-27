import type { Meta, StoryObj } from '@storybook/react';
import { isBefore } from 'date-fns';
import { useState } from 'react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'shared/ui/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultCalendar() {
    const [selected, setSelected] = useState<Date | undefined>();

    return (
      <div className="w-80">
        <Calendar selected={selected} onSelect={setSelected} />
      </div>
    );
  },
};

export const WithSelectedDate: Story = {
  render: function WithSelectedDateCalendar() {
    const [selected, setSelected] = useState<Date | undefined>(new Date());

    return (
      <div className="w-80">
        <Calendar selected={selected} onSelect={setSelected} />
      </div>
    );
  },
};

export const Controlled: Story = {
  render: function ControlledCalendar() {
    const [selected, setSelected] = useState<Date | undefined>(new Date());

    return (
      <div className="w-80 space-y-4">
        <Calendar selected={selected} onSelect={setSelected} />
        <p className="text-sm text-muted-foreground text-center">
          선택된 날짜: {selected?.toLocaleDateString('ko-KR') ?? '없음'}
        </p>
      </div>
    );
  },
};

export const DisabledPastDates: Story = {
  render: function DisabledPastDatesCalendar() {
    const [selected, setSelected] = useState<Date | undefined>();
    const today = new Date();

    return (
      <div className="w-80">
        <Calendar
          selected={selected}
          onSelect={setSelected}
          disabled={(date) => isBefore(date, today) && !isBefore(today, date)}
        />
      </div>
    );
  },
};
