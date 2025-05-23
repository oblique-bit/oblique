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
			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off',
			'@angular-eslint/prefer-signals': 'off',
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'accessor-pairs': 'off',
			'func-names': 'off',
			'no-implicit-coercion': 'off',
			'require-unicode-regexp': 'off'
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
		files: ['projects/sds/**/*.html'],
		rules: {
			// rules that are not respected
			'@angular-eslint/template/prefer-control-flow': 'off',
			'@angular-eslint/template/use-track-by-function': 'off'
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
	},
	{
		files: ['projects/sds/src/app/side-navigation/side-navigation.component.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/max-params': 'off'
		}
	}
];
