// @ts-check
export default [
	{
		files: ['projects/toolchain/**/*.ts'],
		rules: {
			'@typescript-eslint/consistent-return': 'off', // covered by noImplicitReturns
			'default-case': 'off' // covered by noImplicitReturns
		}
	}
];
