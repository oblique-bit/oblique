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
			// this rule would need a massive refactoring as the types are not currently safe
			'@typescript-eslint/no-unsafe-type-assertion': 'off'
		}
	},
	{
		files: ['projects/cli/src/**/*.spec.ts'],
		rules: {
			// these two rules do have valid exceptions and should be deactivated where necessary. This is not possible as the IDE
			// doesn't see the errors and thus removes the deactivation comment
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'no-console': 'off'
		}
	}
];
