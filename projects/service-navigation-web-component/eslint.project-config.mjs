// @ts-check
export default [
	{
		files: ['projects/service-navigation-web-component/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'ob',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'ob',
					style: 'kebab-case'
				}
			],
			// features that are used
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',

			// rules that are not respected
			'@typescript-eslint/no-deprecated': 'off', // need an alternative to provide icons
			'@typescript-eslint/no-magic-numbers': 'off', // would violate member-ordering
			'@typescript-eslint/no-unsafe-return': 'off', // need extensive type checking
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off' // needs strictNullChecks
		}
	}
];
