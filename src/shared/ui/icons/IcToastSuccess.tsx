import type { SVGProps } from 'react';

const SvgIcToastSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...props}
  >
    <circle cx={8} cy={8} r={8} fill="currentColor" />
    <path
      stroke="#FFFFFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.391}
      d="m4.63 7.756 2.517 2.516 4.223-4.225"
    />
  </svg>
);
export default SvgIcToastSuccess;
