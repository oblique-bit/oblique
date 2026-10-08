// @ts-check
export default [
	{
		files: ['tools/cli-registry/src/**/*.spec.ts'],
		rules: {
			// specs restore the captured environment by deleting variables by dynamic key
			'@typescript-eslint/no-dynamic-delete': 'off',
			// vitest matchers such as expect.any evaluate to any
			'@typescript-eslint/no-unsafe-assignment': 'off',
			// env var names (SHELL, MSYSTEM, PSModulePath) are fixed by the operating system and cannot be camelCased
			'@typescript-eslint/naming-convention': 'off',
		},
	},
];
