// @ts-check
export default [
	{
		files: ['projects/cli/**/*.ts'],
		rules: {
			'no-console': [
				'error',
				{
					allow: ['info', 'warn', 'error', 'time', 'timeEnd']
				}
			],
			'@typescript-eslint/consistent-return': 'off', // covered by noImplicitReturns
			'default-case': 'off', // covered by noImplicitReturns

			// rules that are not respected
			'@typescript-eslint/no-unsafe-type-assertion': 'off'
		}
	},
	{
		files: ['projects/cli/src/**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'no-console': 'off'
		}
	}
];
