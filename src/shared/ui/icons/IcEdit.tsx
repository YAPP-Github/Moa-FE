import type { SVGProps } from 'react';

const SvgIcEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    viewBox="0 0 14 14"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="#6B7583"
      fillRule="evenodd"
      d="M8.192 2.529a1.166 1.166 0 0 1 1.65-.001l1.454 1.454c.451.452.456 1.183.01 1.64l-.968.993L7.223 3.5zm-1.588 1.59 3.123 3.123-3.807 3.906a1.75 1.75 0 0 1-1.253.529H3.061a.874.874 0 0 1-.873-.912l.07-1.639c.018-.438.2-.854.51-1.165zm1.354 7.516c0 .242.196.438.437.438h3.571a.437.437 0 0 0 0-.876h-3.57a.437.437 0 0 0-.438.438"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcEdit;
