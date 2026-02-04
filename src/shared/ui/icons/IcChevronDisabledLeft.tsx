import type { SVGProps } from 'react';

const SvgIcChevronDisabledLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    viewBox="0 0 28 28"
    aria-hidden="true"
    {...props}
  >
    <rect width={28} height={28} fill="#F3F4F5" rx={6} transform="matrix(-1 0 0 1 28 0)" />
    <path
      stroke="#A0A9B7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m16 10-4 4 4 4"
    />
  </svg>
);
export default SvgIcChevronDisabledLeft;
