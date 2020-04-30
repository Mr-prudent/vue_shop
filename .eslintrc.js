module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    "linebreak-style": [0 ,"error", "windows"],
    'no-console': 'off',
    'no-plusplus':'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
  },
};
