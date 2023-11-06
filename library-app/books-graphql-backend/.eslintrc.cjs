module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'no-unused-vars': 0,
  },
};
