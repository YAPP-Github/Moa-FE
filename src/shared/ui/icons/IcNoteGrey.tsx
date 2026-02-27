import type { SVGProps } from 'react';

const SvgIcNoteGrey = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={29}
    height={34}
    fill="none"
    viewBox="0 0 29 34"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="#D9DADD"
      d="M0 2a2 2 0 0 1 2-2h24.5a2 2 0 0 1 2 2v21.736a2 2 0 0 1-.51 1.334l-7.394 8.264a2 2 0 0 1-1.49.666H2a2 2 0 0 1-2-2z"
    />
    <mask
      id="ic_note_grey_svg__a"
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
        d="M0 2a2 2 0 0 1 2-2h24.5a2 2 0 0 1 2 2v21.736a2 2 0 0 1-.51 1.334l-7.394 8.264a2 2 0 0 1-1.49.666H2a2 2 0 0 1-2-2z"
      />
    </mask>
    <g mask="url(#ic_note_grey_svg__a)">
      <path fill="#BEBFC6" d="M19.332 24.959a1 1 0 0 1 1-1h10.087L19.331 35.46z" />
    </g>
  </svg>
);
export default SvgIcNoteGrey;
