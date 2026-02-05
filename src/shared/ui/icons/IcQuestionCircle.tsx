import type { SVGProps } from 'react';

const SvgIcQuestionCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="#A0A9B7"
      d="M9 6.563a.94.94 0 0 0-.937.937v.08a.563.563 0 1 1-1.126 0V7.5A2.063 2.063 0 0 1 9 5.438h.087a1.976 1.976 0 0 1 1.286 3.474l-.578.495a.68.68 0 0 0-.232.506v.4a.562.562 0 1 1-1.126 0v-.4c0-.523.229-1.02.625-1.36l.579-.494a.85.85 0 0 0-.554-1.496zm0 6.187a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
    />
    <path
      fill="#A0A9B7"
      d="M2.438 9a6.563 6.563 0 1 1 13.125 0A6.563 6.563 0 0 1 2.438 9M9 3.563a5.438 5.438 0 1 0 0 10.875A5.438 5.438 0 0 0 9 3.563"
    />
  </svg>
);
export default SvgIcQuestionCircle;
