// @ts-check
import baseConfig from './eslint.config.mjs';

// This configuration exists solely for lint-staged.
// As lint-staged only reads the root tsconfig and strict mode is not enabled there, ESLint treats all projects as
// non-strict during pre-commit runs. This causes rules that require strict mode to fail.
export default [
	...baseConfig,
	{
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
		},
	},
];
