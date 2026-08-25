/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

// @ts-check
import {fileURLToPath} from 'node:url';

const eslintTsconfigPath = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));

export default [
	{
		files: ['projects/mcp/**/*.ts'],
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
				{selector: 'property', format: ['camelCase', 'snake_case']},
			],
			'max-classes-per-file': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'default-case': 'off',
		},
	},
	{
		files: ['projects/mcp/**/*.spec.ts'],
		rules: {
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/require-await': 'off',
		},
	},
];
