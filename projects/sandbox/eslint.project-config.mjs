export default [
	{
		files: ['projects/sandbox/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: ['projects/sandbox/tsconfig.app.json', 'projects/sandbox/tsconfig.env.json', 'projects/sandbox/tsconfig.spec.json']
			}
		},

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

			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off',
			'@angular-eslint/prefer-signals': 'off',
			'@angular-eslint/prefer-standalone': 'off',
			'@angular-eslint/prefer-standalone-component': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-deprecated': 'off',
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
		files: ['projects/sandbox/**/*.html'],

		rules: {
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off'
		}
	}
];
