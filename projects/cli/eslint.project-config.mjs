export default [
	{
		files: ['projects/cli/src/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: ['projects/cli/tsconfig.app.json']
			}
		},

		rules: {
			'no-console': [
				'error',
				{
					allow: ['info', 'warn', 'error', 'time', 'timeEnd']
				}
			],

			'@typescript-eslint/no-magic-numbers': [
				'error',
				{
					ignore: [-1, 0, 1]
				}
			]
		}
	},
	{
		files: ['projects/cli/scripts/*.ts'],

		languageOptions: {
			parserOptions: {
				project: ['projects/cli/tsconfig.scripts.json']
			}
		}
	},
	{
		files: ['projects/cli/src/**/*.spec.ts'],

		languageOptions: {
			parserOptions: {
				project: ['projects/cli/tsconfig.spec.json']
			}
		},

		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off'
		}
	}
];
