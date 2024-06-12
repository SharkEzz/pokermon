// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import disableJSTypeChecked from './disable-js-type-checked.js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
);

export { disableJSTypeChecked };
