import type { SVGProps } from 'react';

const SvgIcInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 22"
    aria-hidden="true"
    {...props}
  >
    <rect
      width={20}
      height={20}
      x={0.75}
      y={0.75}
      stroke="currentColor"
      strokeWidth={1.5}
      rx={10}
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.25 18.006V11.21M9.25 11.21h2M11.25 7.812V6.679"
    />
  </svg>
);
export default SvgIcInfo;
