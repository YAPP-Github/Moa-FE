import type { SVGProps } from 'react';

const SvgIcChevronDown = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#6B7583"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="m13 7-4 3.75L5 7"
    />
  </svg>
);
export default SvgIcChevronDown;
