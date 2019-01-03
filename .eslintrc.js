// node core modules

// third-party modules

// internal modules

const { NODE_ENV } = process.env;

const isProduction = NODE_ENV === 'production';

module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    'no-console': isProduction ? 'error' : 'off',
    'no-debugger': isProduction ? 'error' : 'off',
    'prettier/prettier': 'warn',
  },
};
