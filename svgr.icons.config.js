/** @type {import('@svgr/core').Config} */
export default {
  typescript: true,
  icon: false,
  memo: false,
  ref: false,
  svgProps: {
    'aria-hidden': 'true',
  },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      // NOTE: convertColors with currentColor: true was removed
      // because it converts ALL colors to currentColor, breaking
      // icons that have different background/foreground colors.
      // For single-color icons that need to respond to text color,
      // manually set colors to "currentColor" in the source SVG.
      'prefixIds',
    ],
  },
  outDir: 'src/shared/ui/icons',
  filenameCase: 'pascal',
  exportType: 'default',
  jsxRuntime: 'automatic',
  index: false,
};
