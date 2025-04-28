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

			// rules that are not respected
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['projects/cli/src/**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'no-console': 'off'
		}
	}
];
