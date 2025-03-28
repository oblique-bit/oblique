export default [
	{
		files: ['projects/design-system/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: [
					'projects/design-system/tsconfig.lib.json',
					'projects/design-system/tsconfig.spec.json',
					'projects/design-system/tsconfig.scripts.json'
				]
			}
		},

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
	}
];
