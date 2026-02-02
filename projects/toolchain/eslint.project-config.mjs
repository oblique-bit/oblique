// @ts-check
export default [
	{
		files: ['projects/toolchain/**/*.ts'],
		rules: {
			'@typescript-eslint/consistent-return': 'off', // covered by noImplicitReturns
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
			'default-case': 'off', // covered by noImplicitReturns
		},
	},
];
