import type { SVGProps } from 'react';

const SvgIcPlusGrey = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    fill="none"
    viewBox="0 0 10 10"
    aria-hidden="true"
    {...props}
  >
    <path stroke="#6B7583" strokeLinecap="round" strokeWidth={1.3} d="M.65 4.65h8M4.65.65v8" />
  </svg>
);
export default SvgIcPlusGrey;
