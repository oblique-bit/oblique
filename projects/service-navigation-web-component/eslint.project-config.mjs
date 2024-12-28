export default [
	{
		files: ['projects/service-navigation-web-component/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: [
					'projects/service-navigation-web-component/tsconfig.app.json',
					'projects/service-navigation-web-component/tsconfig.spec.json',
					'projects/service-navigation-web-component/tsconfig.scripts.json'
				]
			}
		},

		rules: {
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/prefer-destructuring': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off'
		}
	},
	{
		files: ['projects/service-navigation-web-component/**/*.html'],

		rules: {
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off'
		}
	}
];
