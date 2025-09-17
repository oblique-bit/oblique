// @ts-check
import {defineConfig} from 'eslint/config';
import obliqueEslintConfig from './projects/oblique/eslint.project-config.mjs';
import cliEslintConfig from './projects/cli/eslint.project-config.mjs';
import designSystemEslintConfig from './projects/design-system/eslint.project-config.mjs';
import sandboxEslintConfig from './projects/sandbox/eslint.project-config.mjs';
import sandboxSsrEslintConfig from './projects/sandbox-ssr/eslint.project-config.mjs';
import sdsEslintConfig from './projects/sds/eslint.project-config.mjs';
import serviceNavigationWebComponentEslintConfig from './projects/service-navigation-web-component/eslint.project-config.mjs';
import eslintConfigOblique from './projects/toolchain/src/linting/eslint-config-oblique.mjs';

export default defineConfig(
	{
		// We need to disable TypeScript here because of
		// https://github.com/typescript-eslint/typescript-eslint/issues/11543
		// @ts-ignore
		extends: eslintConfigOblique
	},
	{
		files: ['scripts/shared/log.ts'],
		rules: {
			// special case
			'no-console': ['error', {allow: ['log']}]
		}
	},
	{
		files: ['scripts/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'no-implicit-coercion': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'func-names': 'off'
		}
	},
	{
		files: ['projects/oblique/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'variable', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'variable', format: ['PascalCase'], filter: '^(?:CookiesMock|ObTBreadcrumbConfig|ObliquePackage)$'},
				{selector: 'objectLiteralProperty', format: ['UPPER_CASE'], filter: '^(?:MAT|STEPPER)|^(?:ABN|TEST|DEV|REF|LOCAL)$'},
				{selector: 'objectLiteralProperty', format: ['UPPER_CASE'], filter: '^(?:LABEL_FORMATTER|HIGHLIGHT|VARIANT)'},
				{selector: 'objectLiteralMethod', format: null, modifiers: ['requiresQuotes']},
				{selector: 'typeProperty', format: ['UPPER_CASE'], filter: '^(?:MAT|STEPPER)'},
				{selector: 'typeAlias', format: ['camelCase'], filter: '^versionFunc$'},
				{selector: 'parameter', format: ['PascalCase'], filter: '^CookiesMock$'},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'import', format: null}
			]
		}
	},
	{
		files: ['projects/sds/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']}
			]
		}
	},
	{
		files: ['projects/sandbox/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']}
			]
		}
	},
	...obliqueEslintConfig,
	...cliEslintConfig,
	...designSystemEslintConfig,
	...sandboxEslintConfig,
	...sandboxSsrEslintConfig,
	...sdsEslintConfig,
	...serviceNavigationWebComponentEslintConfig
);
