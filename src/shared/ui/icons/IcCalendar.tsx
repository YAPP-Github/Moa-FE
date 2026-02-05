import type { SVGProps } from 'react';

const SvgIcCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    {...props}
  >
    <rect
      width={13.56}
      height={13.56}
      x={2.22}
      y={2.22}
      stroke="#4E5968"
      strokeWidth={1.44}
      rx={3.78}
    />
    <path
      stroke="#4E5968"
      strokeLinecap="round"
      strokeWidth={1.44}
      d="M2.25 6.75h13.125M6.75 1.5v2.25M11.25 1.5v2.25"
    />
  </svg>
);
export default SvgIcCalendar;
