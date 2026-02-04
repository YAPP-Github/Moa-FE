import type { SVGProps } from 'react';

const SvgIcSclaeDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <rect width={24} height={24} fill="transparent" rx={4} />
    <path
      stroke="#A0A9B7"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M7.078 13.23H9.97a.8.8 0 0 1 .8.8v2.893M10.153 13.846l-4.307 4.308M13.23 7.077V9.97a.8.8 0 0 0 .8.8h2.893M13.847 10.154l4.307-4.307"
    />
  </svg>
);
export default SvgIcSclaeDown;
