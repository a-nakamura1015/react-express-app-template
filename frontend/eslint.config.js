import reactPlugin from 'eslint-plugin-react';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
