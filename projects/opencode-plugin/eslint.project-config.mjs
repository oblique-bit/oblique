/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Phase 1 scaffold for the Oblique OpenCode plugin package
 */

// @ts-check
import {fileURLToPath} from 'node:url';

const eslintTsconfigPath = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));

export default [
	{
		files: ['projects/opencode-plugin/src/**/*.ts', 'src/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: eslintTsconfigPath,
				projectService: false,
			},
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
			],
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'default-case': 'off',
			'max-classes-per-file': 'off',
		},
	},
	{
		files: ['projects/opencode-plugin/tests/**/*.ts', 'tests/**/*.ts'],
		rules: {
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/require-await': 'off',
		},
	},
];
