// @ts-check
export default [
	{
		files: ['projects/sandbox-e2e/**/*.ts'],
		rules: {
			// rules that are not respected
			// these rules need strictNullChecks, which is disabled for this package to allow importing the shared root scripts
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/no-useless-default-assignment': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
		},
	},
];
