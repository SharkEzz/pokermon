// @ts-check

import eslintConfig, { disableJSTypeChecked } from '@pokermon/eslint-config';

export default [
  ...eslintConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...disableJSTypeChecked,
];
