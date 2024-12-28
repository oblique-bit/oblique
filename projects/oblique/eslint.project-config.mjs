export default [
	{
		ignores: ['projects/oblique/styles/**/*', 'schematics/**/*.js']
	},
	{
		files: ['projects/oblique/**/*.ts'],

		languageOptions: {
			parserOptions: {
				project: ['projects/oblique/tsconfig.lib.json', 'projects/oblique/tsconfig.spec.json']
			}
		},

		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'ob',
					style: 'camelCase'
				}
			],

			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'ob',
					style: 'kebab-case'
				}
			],

			// rules that need some refactoring to be enabled
			'@angular-eslint/consistent-component-styles': 'off',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'off',
			'@angular-eslint/prefer-standalone': 'off',
			'@angular-eslint/prefer-standalone-component': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/prefer-destructuring': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'no-warning-comments': 'off'
		}
	},
	{
		files: ['projects/oblique/schematics/**/*.ts'],

		rules: {
			// unwanted rules
			'max-lines': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off',
			'no-param-reassign': 'off',

			// rules that need some refactoring to be enabled
			'@typescript-eslint/no-empty-object-type': 'off'
		}
	},
	{
		files: ['projects/oblique/**/*.decorator.ts'],

		rules: {
			// unwanted rules
			'max-lines-per-function': 'off'
		}
	},
	{
		files: ['projects/oblique/**/mock-*.ts'],

		rules: {
			'@angular-eslint/component-max-inline-declarations': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-empty-function': 'off'
		}
	},
	{
		files: ['projects/oblique/**/*.html'],

		rules: {
			// rules that need some refactoring to be enabled
			'@angular-eslint/template/attributes-order': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-inline-styles': 'off',
			'@angular-eslint/template/prefer-control-flow': 'off'
		}
	}
];
