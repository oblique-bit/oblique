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

			// rules that are not respected
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-return': 'off'
		}
	},
	{
		files: ['projects/service-navigation-web-component/**/*.spec.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off'
		}
	}
];
