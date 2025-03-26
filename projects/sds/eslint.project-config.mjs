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

		languageOptions: {
			parserOptions: {
				project: [
					'projects/sds/tsconfig.app.json',
					'projects/sds/tsconfig.model.json',
					'projects/sds/tsconfig.spec.json',
					'projects/sds/schematics/tsconfig.schematics.json',
					'projects/sds/scripts/tsconfig.scripts.json'
				]
			}
		},

		rules: {
			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off',
			'@angular-eslint/prefer-signals': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/prefer-destructuring': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'func-names': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-param-reassign': 'off'
		}
	},
	{
		files: ['projects/sds/**/*.html'],

		rules: {
			'@angular-eslint/template/prefer-control-flow': 'off',
			'@angular-eslint/template/prefer-static-string-properties': 'off'
		}
	}
];
