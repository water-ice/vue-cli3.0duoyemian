module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'linebreak-style': 'off',
    'global-require': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'max-len': ['error', { code: 200 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
