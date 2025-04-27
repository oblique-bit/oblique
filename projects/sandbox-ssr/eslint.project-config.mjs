// @ts-check
export default [
	{
		files: ['projects/sandbox-ssr/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'ssr',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'ssr',
					style: 'kebab-case'
				}
			]
		}
	},
	{
		files: ['projects/sandbox-ssr/src/app/shared/multi-translate-loader/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['projects/sandbox-ssr/server.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/no-extraneous-class': 'off'
		}
	}
];
