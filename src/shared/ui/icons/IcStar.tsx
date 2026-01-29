import type { SVGProps } from 'react';

const SvgIcStar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8.603.636a1.222 1.222 0 0 1 2.144 0l2.645 4.836c.113.205.281.374.486.486l4.836 2.645a1.222 1.222 0 0 1 0 2.144l-4.836 2.645a1.2 1.2 0 0 0-.486.486l-2.645 4.836a1.222 1.222 0 0 1-2.144 0l-2.645-4.836a1.2 1.2 0 0 0-.486-.486L.636 10.747a1.222 1.222 0 0 1 0-2.144l4.836-2.645c.205-.112.374-.281.486-.486z"
    />
  </svg>
);
export default SvgIcStar;
