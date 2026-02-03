import type { SVGProps } from 'react';

const SvgIcCheckCircleActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    {...props}
  >
    <rect width={18} height={18} fill="#3182F6" rx={9} />
    <path
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="m5.495 8.58 2.617 2.617 4.393-4.394"
    />
  </svg>
);
export default SvgIcCheckCircleActive;
