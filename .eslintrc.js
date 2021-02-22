module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',

    'airbnb-typescript/base',

    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': ['warn', { allow: ['info', 'error'] }],
    quotes: ['error', 'single'],
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-extra-boolean-cast': 'off',

    'import/prefer-default-export': 'off',
    'import/order': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',

    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple', readonly: 'array-simple' }],
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'ctx|args|req|res|next|^_',
      },
    ],
  },
  overrides: [
    // Database
    {
      files: ['./src/db/seeds/**/*.ts', './src/db/migrations/**/*.ts', './src/db/helpers/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'arrow-body-style': 'off',
      },
    },
    // GraphQL Dataloaders
    {
      files: ['./src/**/*.dataloader.ts'],
      rules: {
        'arrow-body-style': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },

    {
      files: ['./src/config/**/*.ts', './src/**/*.util.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'arrow-body-style': 'off',
      },
    },
    {
      files: ['./src/**/*.error.ts', './src/**/*.handler.ts', './src/**/*.util.ts', './src/**/*.graphql-factory.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};