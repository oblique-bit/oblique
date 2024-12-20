import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import eslintMigrationRules from './eslint-migration.rules.mjs';
import obliqueEslintConfig from './projects/oblique/eslint.project-config.mjs';
import cliEslintConfig from './projects/cli/eslint.project-config.mjs';

const maxStatements = 15;
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
	baseDirectory: dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends('eslint:all', 'prettier').map(config => ({
		...config,
		files: ['**/*.js', '**/*.mjs']
	})),
	{
		files: ['**/*.js', '**/*.mjs'],

		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser
			}
		},

		rules: {
			// unwanted rules
			'capitalized-comments': 'off',
			'no-implicit-coercion': 'off',
			'no-undefined': 'off',
			'no-use-before-define': 'off',
			'no-ternary': 'off',
			'one-var': 'off',
			'func-names': 'off',
			'func-style': 'off',
			'require-unicode-regexp': 'off',
			'sort-keys': 'off',

			// rules with improper default values
			'max-statements': ['error', maxStatements],

			'no-console': [
				'error',
				{
					allow: ['info', 'warn', 'error']
				}
			],

			'no-magic-numbers': [
				'error',
				{
					ignore: [-1, 0, 1],
					ignoreArrayIndexes: true
				}
			],

			'sort-imports': [
				'error',
				{
					ignoreDeclarationSort: true
				}
			]
		}
	},
	...compat
		.extends(
			'eslint:all',
			'plugin:@typescript-eslint/eslint-plugin/all',
			'plugin:@angular-eslint/all',
			'plugin:@angular-eslint/template/process-inline-templates',
			'prettier'
		)
		.map(config => ({
			...config,
			files: ['**/*.ts']
		})),
	{
		files: ['**/*.ts'],

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 5,
			sourceType: 'module',

			parserOptions: {
				project: ['tsconfig.json', 'tsconfig.other.json'],
				createDefaultProgram: true
			}
		},

		rules: {
			// unwanted rules
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@angular-eslint/use-component-view-encapsulation': 'off',
			'@angular-eslint/use-injectable-provided-in': 'off',
			'@typescript-eslint/class-methods-use-this': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/init-declarations': 'off',
			'@typescript-eslint/lines-between-class-members': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-invalid-this': 'off',
			'@typescript-eslint/no-parameter-properties': 'off',
			'@typescript-eslint/no-redeclare': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-type-alias': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/prefer-enum-initializers': 'off',
			'@typescript-eslint/prefer-readonly-parameter-types': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/sort-type-constituents': 'off',
			'@typescript-eslint/sort-type-union-intersection-members': 'off',
			'accessor-pairs': 'off',
			'capitalized-comments': 'off',
			'class-methods-use-this': 'off',
			'func-names': 'off',
			'func-style': 'off',
			'line-comment-position': 'off',
			'multiline-comment-style': 'off',
			'new-cap': 'off',
			'no-implicit-coercion': 'off',
			'no-inline-comments': 'off',
			'no-plusplus': 'off',
			'no-ternary': 'off',
			'no-undefined': 'off',
			'no-void': 'off',
			'prefer-object-has-own': 'off',
			'one-var': 'off',
			'require-unicode-regexp': 'off',
			'sort-keys': 'off',

			// rules with improper default values
			'@angular-eslint/component-max-inline-declarations': [
				'error',
				{
					template: 0,
					styles: 0
				}
			],

			'@angular-eslint/no-host-metadata-property': [
				'error',
				{
					allowStatic: true
				}
			],

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					caughtErrors: 'none'
				}
			],

			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true
				}
			],

			'@typescript-eslint/member-ordering': [
				'error',
				{
					default: [
						'public-static-field',
						'public-instance-field',
						'protected-static-field',
						'protected-field',
						'private-static-field',
						'private-field',
						'public-constructor',
						'protected-constructor',
						'private-constructor',
						'public-method',
						'protected-method',
						'private-method'
					]
				}
			],

			'@typescript-eslint/no-extraneous-class': [
				'error',
				{
					allowWithDecorator: true,
					allowStaticOnly: true
				}
			],

			'@typescript-eslint/no-invalid-void-type': [
				'error',
				{
					allowAsThisParameter: true
				}
			],

			'@typescript-eslint/no-use-before-define': [
				'error',
				{
					functions: false
				}
			],

			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowBoolean: true
				}
			],

			'@typescript-eslint/unbound-method': [
				'error',
				{
					ignoreStatic: true
				}
			],

			'max-lines-per-function': [
				'error',
				{
					max: 35
				}
			],

			'max-statements': ['error', maxStatements],

			'no-console': [
				'error',
				{
					allow: ['info', 'warn', 'error']
				}
			],

			'prefer-destructuring': [
				'error',
				{
					object: true
				},
				{
					enforceForRenamedProperties: false
				}
			],

			'sort-imports': [
				'error',
				{
					ignoreDeclarationSort: true
				}
			],
			...eslintMigrationRules
		}
	},
	{
		files: ['**/*.spec.ts'],

		rules: {
			// unwanted rules
			'@angular-eslint/component-max-inline-declarations': 'off',
			'@angular-eslint/use-component-selector': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'max-classes-per-file': 'off',
			'max-lines': 'off',
			'max-lines-per-function': 'off',
			'max-statements': 'off'
		}
	},
	{
		files: ['scripts/**/*.ts'],

		rules: {
			// unwanted rules
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/prefer-destructuring': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'no-console': ['error']
		}
	},
	{
		files: ['scripts/shared/log.ts'],

		rules: {
			// rules with improper default values
			'no-console': [
				'error',
				{
					allow: ['log']
				}
			]
		}
	},
	{
		files: ['eslint.config.mjs'],

		rules: {
			// unwanted rules
			'max-lines': 'off'
		}
	},
	{
		files: ['tests/*.ts'],

		rules: {
			// unwanted rules
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off'
		}
	},
	...compat.extends('plugin:@angular-eslint/template/all').map(config => ({
		...config,
		files: ['**/*.html']
	})),
	{
		files: ['**/*.html'],

		rules: {
			// unwanted rules
			'@angular-eslint/template/i18n': 'off',
			'@angular-eslint/template/use-track-by-function': 'off'
		}
	},
	...obliqueEslintConfig,
	...cliEslintConfig
];
