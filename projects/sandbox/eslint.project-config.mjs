// @ts-check
export default [
	{
		files: ['projects/sandbox/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'sb',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'sb',
					style: 'kebab-case'
				}
			],
			'@angular-eslint/use-injectable-provided-in': ['error', {ignoreClassNamePattern: '/Resolver$/'}],
			'@angular-eslint/prefer-standalone': 'off', // Sandbox is meant to stay without standalone components

			// rules that are not respected because too costly to refactor
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']}
			],
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off' // needs strictNullChecks
		}
	},
	{
		files: ['projects/sandbox/src/**/*.spec.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-floating-promises': 'off'
		}
	},
	{
		files: ['projects/sandbox/**/*.html'],
		rules: {
			// rules that are not respected because too costly to refactor
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off'
		}
	}
];
