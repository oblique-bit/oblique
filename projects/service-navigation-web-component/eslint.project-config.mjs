// @ts-check
export default [
	{
		files: ['projects/service-navigation-web-component/**/*.ts'],
		rules: {
			// rules that are not respected
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['projects/service-navigation-web-component/**/*.html'],
		rules: {
			// rules that are not respected
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off',
			'@angular-eslint/template/use-track-by-function': 'off'
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
