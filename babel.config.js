module.exports = {
  presets: [
    // o current é para converter o codigo para a versão mais atual do node.
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript', // vai ser para entender o Ts
  ],
  plugins: [
    // isso está aqui por causa do reflect-metadata do Tsyringe
    'babel-plugin-transform-typescript-metadata',
    // Esse é por causa do uso dos decorators
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // Aqui já estamos fazendo o mapeamento.
    [
      'module-resolver',
      {
        alias: {
          '@modules': './src/modules',
          '@errors': './src/errors',
          '@utils': './src/utils',
          '@database': './src/database',
        },
      },
    ],
  ],
  // vai ignorar arquivos de testes e o de tipagem.
  ignore: ['**/*.spec.ts', '**/*.d.ts'],
};
