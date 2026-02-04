import type { SVGProps } from 'react';

const SvgIcLinkInactive = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#A9B3BD"
      strokeLinecap="round"
      strokeWidth={1.6}
      d="M19.446 16.905 21.352 15A4.491 4.491 0 0 0 15 8.649l-1.905 1.905m3.81 8.892L15 21.35A4.491 4.491 0 0 1 8.65 15l1.905-1.905"
    />
    <path
      stroke="#A9B3BD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="m16.905 13.095-3.81 3.81"
    />
  </svg>
);
export default SvgIcLinkInactive;
