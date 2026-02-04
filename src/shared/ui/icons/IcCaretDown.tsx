import type { SVGProps } from 'react';

const SvgIcCaretDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      stroke="#6B7684"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="m16 10-4 4-4-4"
    />
  </svg>
);
export default SvgIcCaretDown;
