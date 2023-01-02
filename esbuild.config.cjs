const path = require('path')
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const aliasPlugin = require('esbuild-plugin-path-alias');

module.exports = () => {
  return {
    packager: 'npm',
    bundle: true,
    minify: false,
    sourcemap: false,
    keepNames: false,
    platform: 'neutral',
    target: 'node18',
    splitting: true,
    format: 'esm',
    outputFileExtension: '.mjs',
    packagerOptions: {
      pattern: ['./\*_/_.(js|ts)'],
    },
    plugins: [
      aliasPlugin({
        '@lib': path.resolve(__dirname, './src/lib')
      }),
      nodeExternalsPlugin(),
    ],
  };
};
