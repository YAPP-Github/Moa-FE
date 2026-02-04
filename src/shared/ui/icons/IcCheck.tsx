import type { SVGProps } from 'react';

const SvgIcCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={45}
    height={45}
    fill="none"
    viewBox="0 0 45 45"
    aria-hidden="true"
    {...props}
  >
    <circle cx={22.494} cy={22.494} r={22.494} fill="#1C8AFF" />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.272}
      d="m13.018 21.807 7.077 7.077 11.875-11.88"
    />
  </svg>
);
export default SvgIcCheck;
