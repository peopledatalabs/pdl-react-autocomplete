module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  plugins: [
    'react',
    'unused-imports',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/no-array-index-key': 'off',
  },
};
