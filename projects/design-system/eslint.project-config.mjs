// @ts-check
export default [
	{
		files: ['projects/design-system/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
		},
	},
];
