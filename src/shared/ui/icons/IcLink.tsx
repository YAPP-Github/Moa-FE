import type { SVGProps } from 'react';

const SvgIcLink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 22"
    aria-hidden="true"
    {...props}
  >
    <path
      stroke="#4E5968"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m15.556 12.728 2.122-2.121a5 5 0 0 0-7.071-7.071l-2.122 2.12m4.243 9.9-2.121 2.122a5 5 0 0 1-7.071-7.071l2.12-2.122"
    />
    <path
      stroke="#4E5968"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.728 8.485-4.243 4.243"
    />
  </svg>
);
export default SvgIcLink;
