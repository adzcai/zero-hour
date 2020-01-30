module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    Phaser: 'readonly',
    $: 'readonly',
    socket: 'readonly',
    io: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'max-len': 'warn',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
  },
};
