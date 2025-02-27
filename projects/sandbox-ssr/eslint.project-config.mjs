export default [
	{
		files: ['projects/sandbox-ssr/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: [
					'projects/sandbox-ssr/tsconfig.app.json',
					'projects/sandbox-ssr/tsconfig.spec.json',
					'projects/sandbox-ssr/tsconfig.scripts.json'
				]
			}
		},

		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'ssr',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'ssr',
					style: 'kebab-case'
				}
			],

			'@typescript-eslint/no-magic-numbers': [
				'error',
				{
					ignoreReadonlyClassProperties: true
				}
			]
		}
	},
	{
		files: ['projects/sandbox-ssr/**/index.html'],

		rules: {
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/prefer-self-closing-tags': 'off'
		}
	},
	{
		files: ['projects/sandbox-ssr/**/*.spec.ts'],

		rules: {
			'@typescript-eslint/no-magic-numbers': 'off'
		}
	}
];
