import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

const meta = {
  title: 'shared/ui/Dialog',
  component: DialogRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DialogRoot>;

export default meta;
type Story = StoryObj<typeof DialogRoot>;

// 공통 스타일 클래스
const overlayClassName = 'bg-black/50';
const contentClassName = 'rounded-lg border border-[#E5E8EB] bg-white p-5 shadow-lg';
const headerClassName = 'mb-4';
const titleClassName = 'text-lg font-semibold text-[#191F28]';
const descriptionClassName = 'mt-1 text-sm text-[#6B7684]';
const footerClassName = 'mt-6 flex justify-end gap-2';

// Secondary 버튼 스타일 (Button 컴포넌트에 없는 variant)
const secondaryButtonClassName =
  'inline-flex items-center justify-center rounded-md border border-[#E5E8EB] bg-white px-4 py-2 text-sm font-medium text-[#6B7684] hover:bg-[#F9FAFB]';

export const Default: Story = {
  render: () => {
    return (
      <DialogRoot>
        <DialogTrigger>
          <Button>다이얼로그 열기</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClassName} />
          <DialogContent className={contentClassName}>
            <DialogHeader className={headerClassName}>
              <DialogTitle className={titleClassName}>다이얼로그 제목</DialogTitle>
              <DialogDescription className={descriptionClassName}>
                이 다이얼로그는 중요한 정보를 표시하거나 사용자 확인을 요청할 때 사용됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-[#4E5968]">
              다이얼로그의 본문 내용이 여기에 들어갑니다. 필요한 정보나 폼을 배치할 수 있습니다.
            </div>
            <DialogFooter className={footerClassName}>
              <DialogClose>
                <Button variant="ghost" className={secondaryButtonClassName}>
                  취소
                </Button>
              </DialogClose>
              <DialogClose>
                <Button>확인</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    );
  },
};

export const WithCloseButton: Story = {
  name: 'With Close Button (Default)',
  render: () => {
    return (
      <DialogRoot>
        <DialogTrigger>
          <Button>다이얼로그 열기</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClassName} />
          <DialogContent className={contentClassName}>
            <DialogHeader className={headerClassName}>
              <DialogTitle className={titleClassName}>닫기 버튼이 있는 다이얼로그</DialogTitle>
              <DialogDescription className={descriptionClassName}>
                우측 상단에 X 버튼이 기본으로 표시됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-[#4E5968]">ESC 키로도 닫을 수 있습니다.</div>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    );
  },
};

export const WithoutCloseButton: Story = {
  name: 'Without Close Button',
  render: () => {
    return (
      <DialogRoot>
        <DialogTrigger>
          <Button>다이얼로그 열기</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClassName} />
          <DialogContent className={contentClassName} hideCloseButton>
            <DialogHeader className={headerClassName}>
              <DialogTitle className={titleClassName}>닫기 버튼 없는 다이얼로그</DialogTitle>
              <DialogDescription className={descriptionClassName}>
                hideCloseButton prop으로 X 버튼을 숨길 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-[#4E5968]">Footer의 버튼으로만 닫을 수 있습니다.</div>
            <DialogFooter className={footerClassName}>
              <DialogClose>
                <Button>닫기</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    return (
      <DialogRoot>
        <DialogTrigger>
          <Button>프로필 수정</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClassName} />
          <DialogContent className={`${contentClassName} sm:max-w-[434px]`}>
            <DialogHeader className={headerClassName}>
              <DialogTitle className={titleClassName}>프로필 수정</DialogTitle>
              <DialogDescription className={descriptionClassName}>
                프로필 정보를 수정합니다. 완료 후 저장 버튼을 클릭하세요.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">이름</FieldLabel>
                <Input id="name" type="text" placeholder="이름을 입력하세요" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input id="email" type="email" placeholder="이메일을 입력하세요" />
              </Field>
            </form>
            <DialogFooter className={footerClassName}>
              <DialogClose>
                <Button variant="ghost" className={secondaryButtonClassName}>
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    );
  },
};

export const CustomWidths: Story = {
  name: 'Custom Widths (252px, 400px, 434px, 708px)',
  render: () => {
    return (
      <div className="flex flex-wrap gap-4">
        {/* 252px - 작은 알림 */}
        <DialogRoot>
          <DialogTrigger>
            <Button variant="ghost" className={secondaryButtonClassName}>
              252px (알림)
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogContent className={`${contentClassName} sm:max-w-[252px]`}>
              <DialogHeader className={headerClassName}>
                <DialogTitle className={titleClassName}>알림</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-[#4E5968]">저장되었습니다.</div>
              <DialogFooter className="mt-4 flex justify-center">
                <DialogClose>
                  <Button>확인</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>

        {/* 400px - 확인 다이얼로그 */}
        <DialogRoot>
          <DialogTrigger>
            <Button variant="ghost" className={secondaryButtonClassName}>
              400px (확인)
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogContent className={`${contentClassName} sm:max-w-[400px]`}>
              <DialogHeader className={headerClassName}>
                <DialogTitle className={titleClassName}>삭제하시겠습니까?</DialogTitle>
                <DialogDescription className={descriptionClassName}>
                  이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className={footerClassName}>
                <DialogClose>
                  <Button variant="ghost" className={secondaryButtonClassName}>
                    취소
                  </Button>
                </DialogClose>
                <DialogClose>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    삭제
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>

        {/* 434px - 일반 폼 */}
        <DialogRoot>
          <DialogTrigger>
            <Button variant="ghost" className={secondaryButtonClassName}>
              434px (폼)
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogContent className={`${contentClassName} sm:max-w-[434px]`}>
              <DialogHeader className={headerClassName}>
                <DialogTitle className={titleClassName}>팀 초대</DialogTitle>
                <DialogDescription className={descriptionClassName}>
                  팀에 새로운 멤버를 초대합니다.
                </DialogDescription>
              </DialogHeader>
              <div>
                <input
                  type="email"
                  className="w-full rounded-md border border-[#E5E8EB] px-3 py-2 text-sm"
                  placeholder="이메일 주소 입력"
                />
              </div>
              <DialogFooter className={footerClassName}>
                <DialogClose>
                  <Button variant="ghost" className={secondaryButtonClassName}>
                    취소
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button>초대</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>

        {/* 708px - 큰 콘텐츠 */}
        <DialogRoot>
          <DialogTrigger>
            <Button variant="ghost" className={secondaryButtonClassName}>
              708px (큰 콘텐츠)
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogContent className={`${contentClassName} sm:max-w-[708px]`}>
              <DialogHeader className={headerClassName}>
                <DialogTitle className={titleClassName}>이용 약관</DialogTitle>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto text-sm text-[#4E5968]">
                <p className="mb-4">
                  본 약관은 서비스 이용에 관한 기본적인 사항을 규정합니다. 서비스를 이용하시기 전에
                  반드시 본 약관을 읽어주시기 바랍니다.
                </p>
                <p className="mb-4">
                  제1조 (목적) 이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의
                  권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
                <p className="mb-4">
                  제2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다. "서비스"란 회사가
                  제공하는 모든 서비스를 의미합니다. "이용자"란 회사의 서비스에 접속하여 이 약관에
                  따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                </p>
                <p>
                  제3조 (약관의 효력 및 변경) 본 약관은 서비스를 이용하고자 하는 모든 이용자에
                  대하여 그 효력을 발생합니다.
                </p>
              </div>
              <DialogFooter className={footerClassName}>
                <DialogClose>
                  <Button variant="ghost" className={secondaryButtonClassName}>
                    닫기
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button>동의</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
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
          <Button
            variant="ghost"
            className={secondaryButtonClassName}
            onClick={() => setOpen(false)}
          >
            외부에서 닫기
          </Button>
        </div>

        <DialogRoot open={open} onOpenChange={setOpen}>
          <DialogPortal>
            <DialogOverlay className={overlayClassName} />
            <DialogContent className={contentClassName}>
              <DialogHeader className={headerClassName}>
                <DialogTitle className={titleClassName}>Controlled Dialog</DialogTitle>
                <DialogDescription className={descriptionClassName}>
                  외부 상태로 제어되는 다이얼로그입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm text-[#4E5968]">
                open, onOpenChange props로 외부에서 상태를 제어할 수 있습니다.
              </div>
              <DialogFooter className={footerClassName}>
                <DialogClose>
                  <Button>닫기</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    );
  },
};
