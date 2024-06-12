import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
];
