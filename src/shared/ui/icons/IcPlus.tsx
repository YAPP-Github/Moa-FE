import type { SVGProps } from 'react';

const SvgIcPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={9}
    fill="none"
    viewBox="0 0 9 9"
    aria-hidden="true"
    {...props}
  >
    <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.2} d="M.6 4.1h7M4.096.6v7" />
  </svg>
);
export default SvgIcPlus;
