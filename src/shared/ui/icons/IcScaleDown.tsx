import type { SVGProps } from 'react';

const SvgIcScaleDown = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#6B7583"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M7.076 13.23h2.892a.8.8 0 0 1 .8.8v2.893M10.153 13.846l-4.307 4.308M13.229 7.077V9.97a.8.8 0 0 0 .8.8h2.892M13.845 10.154l4.307-4.307"
    />
  </svg>
);
export default SvgIcScaleDown;
