let defaultPresets

if (process.env.BABEL_ENV === 'es') {
  // Release an ES version of the library.
  // It's something that matches the latest official supported features of JavaScript.
  // Nothing more (stage-1, etc), nothing less (require, etc).
  defaultPresets = []
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: ['esm', 'production-umd'].includes(process.env.BABEL_ENV)
          ? false
          : 'commonjs',
      },
    ],
  ]
}

const prodPlugins = [['@babel/plugin-transform-runtime', {useESModules: true}]]

module.exports = {
  presets: defaultPresets.concat([
    '@babel/preset-react',
    '@babel/preset-typescript',
  ]),
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    ['@babel/plugin-proposal-object-rest-spread', {loose: true}],
    // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
    ['@babel/plugin-transform-runtime', {version: '^7.4.4'}],
    // // for IE 11 support
    // '@babel/plugin-transform-object-assign',
  ],
  env: {
    esm: {
      plugins: prodPlugins,
    },
    es: {
      plugins: prodPlugins,
    },
    production: {
      plugins: prodPlugins,
    },
    'production-umd': {
      plugins: prodPlugins,
    },
  },
}
