// @ts-check
export default [
	{
		ignores: [
			'projects/sds/schematics/src/add-preview/templates/*',
			'projects/sds/schematics/src/add-code-example/templates/*',
			'projects/sds/schematics/src/**/*.js'
		]
	},
	{
		files: ['projects/sds/**/*.ts'],
		rules: {
			// rules that are not respected
			'@angular-eslint/prefer-output-emitter-ref': 'off',
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': ['error', {ignoreClassNamePattern: 'CollectorService'}],
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']}
			],
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-type-conversion': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
			'accessor-pairs': 'off'
		}
	},
	{
		files: ['projects/sds/**/*.spec.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-floating-promises': 'off'
		}
	},
	{
		files: ['projects/sds/**/*.html'],
		rules: {
			'@angular-eslint/template/cyclomatic-complexity': 'off'
		}
	},
	{
		files: ['projects/sds/src/app/code-examples/code-examples.model.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',

			// rules that are not respected
			'@typescript-eslint/no-unsafe-return': 'off'
		}
	},
	{
		files: ['projects/sds/schematics/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/max-params': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-param-reassign': 'off'
		}
	}
];
