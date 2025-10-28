// @ts-check
export default [
	{
		ignores: []
	},
	{
		files: ['projects/ob-tour/src/lib/**/*harness.ts', 'projects/ob-tour/src/lib/**/_harness/**/*.harness.ts'],
		rules: {
			// rules that are not respected
			'no-await-in-loop': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-floating-promises': 'off'
		}
	},
	{
		files: ['projects/ob-tour/src/lib/**/*.spec.ts'],
		rules: {
			'@typescript-eslint/init-declarations': 'off',
			'max-lines-per-function': 'off',
			'no-promise-executor-return': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},
	{
		files: ['projects/ob-tour/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'obt',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'obt',
					style: 'kebab-case'
				}
			],

			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',

			// rules that are not respected
			'@angular-eslint/component-max-inline-declarations': 'off',
			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off',
			'@angular-eslint/prefer-signals': 'off',
			'@angular-eslint/prefer-standalone': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'variable', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'objectLiteralMethod', format: null, modifiers: ['requiresQuotes']},
				{selector: 'typeAlias', format: ['camelCase'], filter: '^versionFunc$'},
				{selector: 'parameter', format: ['PascalCase'], filter: '^CookiesMock$'},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'import', format: null}
			],
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/prefer-enum-initializers': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
			'accessor-pairs': 'off',
			'func-names': 'off',
			'no-duplicate-imports': 'off',
			'no-implicit-coercion': 'off',
			'no-warning-comments': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['projects/ob-tour/**/*.decorator.ts'],
		rules: {
			'max-lines-per-function': 'off'
		}
	},
	{
		files: ['projects/ob-tour/**/.*mock*.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-empty-function': 'off'
		}
	},
	{
		files: ['projects/ob-tour/schematics/**/*.ts', 'projects/ob-tour/lib/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-empty-object-type': 'off',
			'max-lines': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-param-reassign': 'off'
		}
	},
	{
		files: ['projects/ob-tour/**/*.html'],
		rules: {
			// rules that are not respected
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off',
			'@angular-eslint/template/use-track-by-function': 'off'
		}
	}
];
