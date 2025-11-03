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
			],

			// rules that are not respected
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off' // needs strictNullChecks
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
	}
];
