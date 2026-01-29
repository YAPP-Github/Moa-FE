import type { SVGProps } from 'react';

const SvgIcDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    {...props}
  >
    <circle cx={9} cy={9} r={7.875} fill="currentColor" />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.125}
      d="m6.188 6.188 5.625 5.625M6.188 11.813l5.625-5.626"
    />
  </svg>
);
export default SvgIcDelete;
