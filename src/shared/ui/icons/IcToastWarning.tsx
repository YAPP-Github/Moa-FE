import type { SVGProps } from 'react';

const SvgIcToastWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...props}
  >
    <g clipPath="url(#a)">
      <circle cx={8} cy={8} r={8} fill="#FFC342" />
      <path
        fill="#212124"
        d="M7.126 5.256a.875.875 0 1 1 1.749 0l-.16 3.659a.716.716 0 0 1-1.43 0z"
      />
      <rect width={1.778} height={1.778} x={7.111} y={10.311} fill="#212124" rx={0.889} />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIcToastWarning;
