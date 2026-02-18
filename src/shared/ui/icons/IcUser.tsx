import type { SVGProps } from 'react';

const SvgIcUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    {...props}
  >
    <circle
      cx={3}
      cy={3}
      r={3}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.125}
      transform="matrix(-1 0 0 1 12 2.25)"
    />
    <path
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.125}
      d="M3.75 12.701c0-.645.406-1.22 1.013-1.438a12.6 12.6 0 0 1 8.474 0 1.53 1.53 0 0 1 1.013 1.438v.987c0 .89-.789 1.574-1.67 1.448l-.716-.102a20.3 20.3 0 0 0-5.728 0l-.716.102a1.464 1.464 0 0 1-1.67-1.448z"
    />
  </svg>
);
export default SvgIcUser;
