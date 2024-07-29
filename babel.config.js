module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    // Não precisa mais estar aqui
    [
      'module-resolver',
      {
        alias: {
          '@modules': './src/modules',
          '@errors': './src/errors',
          '@utils': './src/utils',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts', '**/*.d.ts'],
};
