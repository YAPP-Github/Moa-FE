import type { SVGProps } from 'react';

const SvgIcRefresh = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13.65 2.35C12.2.9 10.21 0 8 0 3.58 0 .01 3.58.01 8 .01 12.42 3.58 16 8 16c3.73 0 6.84-2.55 7.73-6h-2.08C12.83 12.33 10.61 14 8 14c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35Z"
    />
  </svg>
);
export default SvgIcRefresh;
