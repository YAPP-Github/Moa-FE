import type { SVGProps } from 'react';

const SvgIcChevronActiveRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    viewBox="0 0 28 28"
    aria-hidden="true"
    {...props}
  >
    <rect width={28} height={28} fill="#F3F4F5" rx={6} />
    <path
      stroke="#333D4B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12 10 4 4-4 4"
    />
  </svg>
);
export default SvgIcChevronActiveRight;
