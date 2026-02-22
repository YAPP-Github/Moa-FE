import type { SVGProps } from 'react';

const SvgIcFront = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      stroke="#4E5968"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.143}
      d="M10 8.286 14 12l-4 3.715"
    />
  </svg>
);
export default SvgIcFront;
