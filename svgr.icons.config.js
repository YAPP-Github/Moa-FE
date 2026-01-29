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
      {
        name: 'convertColors',
        params: {
          currentColor: true,
        },
      },
    ],
  },
  outDir: 'src/shared/ui/icons',
  filenameCase: 'pascal',
  exportType: 'default',
  jsxRuntime: 'automatic',
  index: false,
};
