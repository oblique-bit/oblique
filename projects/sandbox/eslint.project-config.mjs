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

			// rules that are not respected
			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/prefer-signals': 'off',
			'@angular-eslint/prefer-standalone': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/prefer-enum-initializers': 'off'
		}
	},
	{
		files: ['projects/sandbox/**/*.html'],
		rules: {
			// rules that are not respected
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off',
			'@angular-eslint/template/use-track-by-function': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/app-routing.module.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/promise-function-async': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/app.component.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/max-params': 'off',
			'no-implicit-coercion': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/samples/unsaved-changes/unsaved-changes-sample.component.ts'],
		rules: {
			// rules that are not respected
			'@angular-eslint/use-component-view-encapsulation': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/samples/http-interceptor/http-mock-error.interceptor.ts'],
		rules: {
			// rules that are not respected
			'no-implicit-coercion': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/samples/autocomplete/autocomplete.component.ts'],
		rules: {
			// rules that are not respected
			curly: 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/samples/samples.module.ts'],
		rules: {
			// rules that are not respected
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off'
		}
	},
	{
		files: ['projects/sandbox/src/app/material/tooltip/tooltip.component.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/explicit-module-boundary-types': 'off'
		}
	}
];
