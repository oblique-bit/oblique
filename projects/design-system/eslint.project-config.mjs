// @ts-check
export default [
	{
		files: ['projects/design-system/**/*.ts'],
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
			]
		}
	},
	{
		files: ['projects/design-system/**/*.spec.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/consistent-type-imports': 'off'
		}
	}
];
