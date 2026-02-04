import type { SVGProps } from 'react';

const SvgIcLinkActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 30 30"
    aria-hidden="true"
    {...props}
  >
    <path
      stroke="#2C3745"
      strokeLinecap="round"
      strokeWidth={1.6}
      d="M19.446 16.905 21.351 15a4.491 4.491 0 1 0-6.35-6.351l-1.906 1.905m3.81 8.892L15 21.35A4.491 4.491 0 0 1 8.649 15l1.905-1.905"
    />
    <path
      stroke="#2C3745"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="m16.905 13.095-3.81 3.81"
    />
  </svg>
);
export default SvgIcLinkActive;
