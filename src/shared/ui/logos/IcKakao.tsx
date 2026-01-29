import type { SVGProps } from 'react';

const SvgIcKakao = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={15}
    fill="none"
    viewBox="0 0 16 15"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="#212124"
      fillRule="evenodd"
      d="M7.982 0C3.572 0 0 2.882 0 6.392c0 2.29 1.494 4.285 3.718 5.43l-.766 2.846c-.036.073 0 .184.073.258.037.037.11.074.146.074s.11-.037.146-.037l3.243-2.217c.474.074.948.111 1.458.111 4.41 0 7.982-2.882 7.982-6.391C16 2.882 12.428 0 7.982 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcKakao;
