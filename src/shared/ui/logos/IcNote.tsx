import type { SVGProps } from 'react';

const SvgIcNote = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={29}
    height={34}
    fill="none"
    viewBox="0 0 29 34"
    aria-hidden="true"
    shape-rendering="geometricPrecision"
    {...props}
  >
    <path
      fill="#D9DADD"
      d="M0 2C0 0.89543 0.895431 0 2 0H26.5C27.6046 0 28.5 0.895431 28.5 2V23.7359C28.5 24.2279 28.3186 24.7027 27.9905 25.0695L20.5963 33.3336C20.2169 33.7576 19.6748 34 19.1058 34H2C0.895431 34 0 33.1046 0 32V2Z"
    />
    <mask
      id="ic_note_svg__a"
      width={29}
      height={34}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path
        fill="#DEE0E4"
        d="M0 2C0 0.89543 0.895431 0 2 0H26.5C27.6046 0 28.5 0.895431 28.5 2V23.7359C28.5 24.2279 28.3186 24.7027 27.9905 25.0695L20.5963 33.3336C20.2169 33.7576 19.6748 34 19.1058 34H2C0.895431 34 0 33.1046 0 32V2Z"
      />
    </mask>
    <g mask="url(#ic_note_svg__a)">
      <path
        fill="#BEBFC6"
        d="M19.3317 24.9589C19.3317 24.4067 19.7794 23.959 20.3317 23.9589L30.4193 23.9585L19.3317 35.4605L19.3317 24.9589Z"
      />
    </g>
  </svg>
);
export default SvgIcNote;
