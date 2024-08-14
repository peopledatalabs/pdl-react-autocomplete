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
    '@typescript-eslint',
    'simple-import-sort',
    'typescript-sort-keys',
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
    'max-len': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'object-curly-newline': 'off',
    'typescript-sort-keys/interface': ['error', 'asc', {
      caseSensitive: false,
      natural: true,
      requiredFirst: false,
    }],
    'typescript-sort-keys/string-enum': ['error', 'asc', {
      caseSensitive: false,
      natural: true,
    }],
  },
};
