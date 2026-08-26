/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

// @ts-check
import {fileURLToPath} from 'node:url';

const sourceEslintTsconfigPath = fileURLToPath(new URL('./tsconfig.eslint.json', import.meta.url));
const fixtureEslintTsconfigPath = fileURLToPath(new URL('./tsconfig.fixtures.json', import.meta.url));

export default [
	{
		files: ['projects/mcp/src/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: sourceEslintTsconfigPath,
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
		files: ['projects/mcp/fixtures/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: fixtureEslintTsconfigPath,
				projectService: false,
			},
		},
		rules: {
			// Fixtures deliberately model public export names, duplicate re-export declarations and deprecated APIs.
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unused-private-class-members': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@angular-eslint/use-pipe-transform-interface': 'off',
			'max-classes-per-file': 'off',
			'new-cap': 'off',
			'no-duplicate-imports': 'off',
			'prefer-const': 'off',
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
	{
		files: ['projects/mcp/src/server.ts'],
		rules: {
			'max-lines': 'off',
			'max-statements': 'off',
		},
	},
	{
		files: [
			'projects/mcp/src/analyzers/oblique-code.analyzer.ts',
			'projects/mcp/src/analyzers/oblique-styles.analyzer.ts',
			'projects/mcp/src/analyzers/oblique-template.analyzer.ts',
			'projects/mcp/src/sources/design-system/design-token.reader.ts',
			'projects/mcp/src/sources/oblique/migration.reader.ts',
			'projects/mcp/src/sources/oblique/public-api.reader.ts',
			'projects/mcp/src/sources/sds/sds-examples.reader.ts',
			'projects/mcp/src/tools/search-oblique-design-tokens.ts',
			'projects/mcp/src/tools/search-oblique.ts',
		],
		rules: {
			'@typescript-eslint/init-declarations': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-misused-spread': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/prefer-regexp-exec': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'max-lines': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-continue': 'off',
			'prefer-named-capture-group': 'off',
			'no-bitwise': 'off',
		},
	},
	{
		files: ['projects/mcp/src/analyzers/oblique-styles.analyzer.ts'],
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
			'no-await-in-loop': 'off',
		},
	},
];
