import type { SVGProps } from 'react';

const SvgIcMeatball = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <circle cx={7.714} cy={12.001} r={1.286} fill="#273959" />
    <circle cx={12} cy={12.001} r={1.286} fill="#273959" />
    <circle cx={16.286} cy={12.001} r={1.286} fill="#273959" />
  </svg>
);
export default SvgIcMeatball;
