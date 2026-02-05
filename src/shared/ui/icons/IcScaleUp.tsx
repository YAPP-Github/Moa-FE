import type { SVGProps } from 'react';

const SvgIcScaleUp = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.333}
      d="M9.68 18.41H6.667a.833.833 0 0 1-.833-.833v-3.013m.641 3.205 4.487-4.487m7.692-3.846V6.423a.833.833 0 0 0-.833-.833h-3.013m3.205.64-4.487 4.488"
    />
  </svg>
);
export default SvgIcScaleUp;
