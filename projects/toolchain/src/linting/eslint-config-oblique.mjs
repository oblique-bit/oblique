import {plugin, parser} from 'typescript-eslint';
import {processInlineTemplates, templatePlugin, tsPlugin, templateParser} from 'angular-eslint';

export default [
	{
		files: ['**/*.ts'],
		plugins: {
			'@typescript-eslint': plugin,
			'@angular-eslint': tsPlugin,
		},
		processor: processInlineTemplates,
		languageOptions: {
			parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			sourceType: 'module',
		},
		rules: {
			// https://eslint.org/docs/latest/rules
			'accessor-pairs': 'error',
			'array-callback-return': 'error',
			/**
			 * Rule: arrow-body-style (https://eslint.org/docs/latest/rules/arrow-body-style)
			 * Reason for disabling: Replaced by prettier
			 */
			'arrow-body-style': 'off',
			'block-scoped-var': 'error',
			/**
			 * Rule: camelcase (https://eslint.org/docs/latest/rules/camelcase)
			 * Reason for disabling: Replaced by @typescript-eslint/naming-convention
			 */
			camelcase: 'off',
			/**
			 * Rule: capitalized-comments (https://eslint.org/docs/latest/rules/capitalized-comments)
			 * Reason for disabling: Comments can either be capitalized or not, depending on the context. Inline comments
			 * are usually not capitalized whereas block comments are.
			 * Also, sometimes a comment starts with a code example, which may or may not be capitalized.
			 * Therefore, this rule is too strict and can lead to many false positives.
			 */
			'capitalized-comments': 'off',
			/**
			 * Rule: class-methods-use-this (https://eslint.org/docs/latest/rules/class-methods-use-this)
			 * Reason for disabling: Replaced by @typescript-eslint/class-methods-use-this
			 */
			'class-methods-use-this': 'off',
			complexity: 'error',
			/**
			 * Rule: consistent-return (https://eslint.org/docs/latest/rules/consistent-return)
			 * Reason for disabling: Replaced by @typescript-eslint/consistent-return
			 */
			'consistent-return': 'off',
			'consistent-this': 'error',
			'constructor-super': 'error',
			curly: 'error',
			'default-case': 'error',
			'default-case-last': 'error',
			/**
			 * Rule: default-param-last (https://eslint.org/docs/latest/rules/default-param-last)
			 * Reason for disabling: Replaced by @typescript-eslint/default-param-last
			 */
			'default-param-last': 'off',
			/**
			 * Rule: dot-notation (https://eslint.org/docs/latest/rules/dot-notation)
			 * Reason for disabling: Replaced by @typescript-eslint/dot-notation
			 */
			'dot-notation': 'off',
			eqeqeq: 'error',
			'for-direction': 'error',
			'func-name-matching': 'error',

			/**
			 * Rule: func-names (https://eslint.org/docs/latest/rules/func-names)
			 * Reason for 'as-needed': Named functions are only necessary fpr debugging purposes so that the name appears in the stack trace.
			 * 'as-needed' ensures that each function whose name cannot be inferred has an explicit name.
			 */
			'func-names': ['error', 'as-needed'],
			/**
			 * Rule: func-style (https://eslint.org/docs/latest/rules/func-style)
			 * Reason for disabling: It is not possible of enforce a single function style as both are used. Almost all functions
			 * are expressive, but some, like exported ones, are declarative. Enforcing one style would lead to many exceptions.
			 */
			'func-style': 'off',
			'getter-return': 'error',
			'grouped-accessor-pairs': 'error',
			'guard-for-in': 'error',
			'id-denylist': 'error',
			'id-length': 'error',
			'id-match': 'error',
			/**
			 * Rule: init-declarations (https://eslint.org/docs/latest/rules/init-declarations)
			 * Reason for disabling: Replaced by @typescript-eslint/init-declarations
			 */
			'init-declarations': 'off',
			'logical-assignment-operators': 'error',
			'max-classes-per-file': 'error',
			'max-depth': 'error',
			'max-lines': 'error',
			/**
			 * Rule: max-lines-per-function (https://eslint.org/docs/latest/rules/max-lines-per-function)
			 * Reason for {max: 35}: The default value of 50 is too high. 35 is an empiric value that works well
			 */
			'max-lines-per-function': ['error', {max: 35}],
			'max-nested-callbacks': 'error',
			/**
			 * Rule: max-params
			 * Reason for disabling: Replaced by @typescript-eslint/max-params
			 */
			'max-params': 'off',
			/**
			 * Rule: max-statements (https://eslint.org/docs/latest/rules/max-statements)
			 * Reason for {max: 15}: The default value of 00 is too low. 15 is an empiric value that works well
			 */
			'max-statements': ['error', {max: 15}],
			/**
			 * Rule: new-cap (https://eslint.org/docs/latest/rules/new-cap)
			 * Reason for exceptions: Angular keywords are obviously allowed
			 * Note: Exceptions could be removed once the migration to signal is complete
			 */
			'new-cap': [
				'error',
				{
					capIsNewExceptions: [
						'Attribute',
						'Component',
						'ContentChild',
						'ContentChildren',
						'Directive',
						'HostBinding',
						'HostListener',
						'Injectable',
						'Inject',
						'Input',
						'NgModule',
						'Optional',
						'Output',
						'Pipe',
						'SkipSelf',
						'ViewChild',
						'ViewChildren',
					],
				},
			],
			'no-alert': 'error',
			/**
			 * Rule: no-array-constructor (https://eslint.org/docs/latest/rules/no-array-constructor)
			 * Reason for disabling: Replaced by @typescript-eslint/no-array-constructor
			 */
			'no-array-constructor': 'off',
			'no-async-promise-executor': 'error',
			'no-await-in-loop': 'error',
			'no-bitwise': 'error',
			'no-caller': 'error',
			'no-case-declarations': 'error',
			'no-class-assign': 'error',
			'no-compare-neg-zero': 'error',
			'no-cond-assign': 'error',
			'no-const-assign': 'error',
			'no-constant-binary-expression': 'error',
			'no-constant-condition': 'error',
			'no-constructor-return': 'error',
			/**
			 * Rule: no-console (https://eslint.org/docs/latest/rules/no-console)
			 * Reason for allowing: Console message are mostly used for debugging purposes and should be removed in production.
			 * 'info', 'warn' and 'error' are legitimate messages in production
			 */
			'no-console': ['error', {allow: ['info', 'warn', 'error']}],
			'no-continue': 'error',
			'no-control-regex': 'error',
			'no-debugger': 'error',
			'no-delete-var': 'error',
			'no-div-regex': 'error',
			'no-dupe-args': 'error',
			/**
			 * Rule: no-dupe-class-members (https://eslint.org/docs/latest/rules/no-dupe-class-members)
			 * Reason for disabling: Replaced by @typescript-eslint/no-dupe-class-members
			 */
			'no-dupe-class-members': 'off',
			'no-dupe-else-if': 'error',
			'no-dupe-keys': 'error',
			'no-duplicate-case': 'error',
			/**
			 * Rule: no-duplicate-imports (https://eslint.org/docs/latest/rules/no-duplicate-imports)
			 * Reason for {includeExports: true}: Ensures that exports are also not duplicated
			 */
			'no-duplicate-imports': ['error', {includeExports: true}],
			'no-else-return': 'error',
			'no-empty': 'error',
			'no-empty-character-class': 'error',
			/**
			 * Rule: no-empty-function (https://eslint.org/docs/latest/rules/no-empty-function)
			 * Reason for disabling: Replaced by @typescript-eslint/no-empty-function
			 */
			'no-empty-function': 'off',
			'no-empty-pattern': 'error',
			'no-empty-static-block': 'error',
			'no-eq-null': 'error',
			'no-eval': 'error',
			'no-ex-assign': 'error',
			'no-extend-native': 'error',
			'no-extra-bind': 'error',
			'no-extra-boolean-cast': 'error',
			'no-extra-label': 'error',
			'no-fallthrough': 'error',
			'no-func-assign': 'error',
			'no-global-assign': 'error',
			'no-implicit-coercion': 'error',
			'no-implicit-globals': 'error',
			/**
			 * Rule: no-implied-eval (https://eslint.org/docs/latest/rules/no-implied-eval)
			 * Reason for disabling: Replaced by @typescript-eslint/no-implied-eval
			 */
			'no-implied-eval': 'off',
			'no-import-assign': 'error',
			/**
			 * Rule: no-inline-comments (https://eslint.org/docs/latest/rules/no-inline-comments)
			 * Reason for disabling: Inline comments are often the best place to explain a single line of code.
			 */
			'no-inline-comments': 'off',
			'no-inner-declarations': 'error',
			'no-invalid-regexp': 'error',
			/**
			 * Rule: no-invalid-this (https://eslint.org/docs/latest/rules/no-invalid-this)
			 * Reason for disabling: Replaced by @typescript-eslint/no-invalid-this
			 */
			'no-invalid-this': 'off',
			'no-irregular-whitespace': 'error',
			'no-iterator': 'error',
			'no-label-var': 'error',
			'no-labels': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			/**
			 * Rule: no-loop-func (https://eslint.org/docs/latest/rules/no-loop-func)
			 * Reason for disabling: Replaced by @typescript-eslint/no-loop-func
			 */
			'no-loop-func': 'off',
			'no-loss-of-precision': 'error',
			/**
			 * Rule: no-magic-numbers (https://eslint.org/docs/latest/rules/no-magic-numbers)
			 * Reason for disabling: Replaced by @typescript-eslint/no-magic-numbers
			 */
			'no-magic-numbers': 'off',
			'no-misleading-character-class': 'error',
			'no-multi-assign': 'error',
			'no-multi-str': 'error',
			'no-negated-condition': 'error',
			'no-nested-ternary': 'error',
			'no-new': 'error',
			'no-new-native-nonconstructor': 'error',
			'no-new-func': 'error',
			'no-new-wrappers': 'error',
			'no-nonoctal-decimal-escape': 'error',
			'no-object-constructor': 'error',
			'no-octal': 'error',
			'no-octal-escape': 'error',
			'no-obj-calls': 'error',
			'no-param-reassign': 'error',
			/**
			 * Rule: no-plusplus (https://eslint.org/docs/latest/rules/no-plusplus)
			 * Reason for disabling: ++ and -- are useful operators that should not be banned
			 */
			'no-plusplus': 'off',
			'no-promise-executor-return': 'error',
			'no-proto': 'error',
			'no-prototype-builtins': 'error',
			/**
			 * Rule: no-redeclare (https://eslint.org/docs/latest/rules/no-redeclare)
			 * Reason for disabling: Replaced by @typescript-eslint/no-redeclare
			 */
			'no-redeclare': 'off',
			'no-regex-spaces': 'error',
			'no-restricted-exports': 'error',
			'no-restricted-globals': 'error',
			/**
			 * Rule: no-restricted-imports (https://eslint.org/docs/latest/rules/no-restricted-imports)
			 * Reason for disabling: Replaced by @typescript-eslint/no-restricted-imports
			 */
			'no-restricted-imports': 'off',
			'no-restricted-properties': 'error',
			'no-restricted-syntax': 'error',
			'no-return-assign': 'error',
			'no-script-url': 'error',
			'no-self-assign': 'error',
			'no-self-compare': 'error',
			'no-setter-return': 'error',
			'no-sequences': 'error',
			/**
			 * Rule: no-shadow (https://eslint.org/docs/latest/rules/no-shadow)
			 * Reason for disabling: Replaced by @typescript-eslint/no-shadow
			 */
			'no-shadow': 'off',
			'no-shadow-restricted-names': 'error',
			'no-sparse-arrays': 'error',
			'no-template-curly-in-string': 'error',
			/**
			 * Rule: no-ternary (https://eslint.org/docs/latest/rules/no-ternary)
			 * Reason for disabling: Ternary operator is a useful feature that should not be banned
			 */
			'no-ternary': 'off',
			'no-this-before-super': 'error',
			/**
			 * Rule: no-throw-literal (https://eslint.org/docs/latest/rules/no-throw-literal)
			 * Reason for disabling: Replaced by @typescript-eslint/no-throw-literal
			 */
			'no-throw-literal': 'off',
			'no-unassigned-vars': 'error',
			/**
			 * Rule: no-undef (https://eslint.org/docs/latest/rules/no-undef)
			 * Reason for disabling: Prevents usage of global functions like 'console', or 'setTimeout'
			 */
			'no-undef': 'off',
			'no-unexpected-multiline': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-undef-init': 'error',
			/**
			 * Rule: no-undefined (https://eslint.org/docs/latest/rules/no-undefined)
			 * Reason for disabling: undefined is a useful value that should not be banned
			 */
			'no-undefined': 'off',
			'no-underscore-dangle': 'error',
			'no-unneeded-ternary': 'error',
			'no-unreachable': 'error',
			'no-unreachable-loop': 'error',
			'no-unsafe-finally': 'error',
			'no-unsafe-negation': 'error',
			'no-unsafe-optional-chaining': 'error',
			/**
			 * Rule: no-unused-expressions (https://eslint.org/docs/latest/rules/no-unused-expressions)
			 * Reason for disabling: Replaced by @typescript-eslint/no-unused-expressions
			 */
			'no-unused-expressions': 'off',
			'no-unused-labels': 'error',
			/**
			 * Rule: no-unused-private-class-members (https://eslint.org/docs/latest/rules/no-unused-private-class-members)
			 * Reason for disabling: Replaced by @typescript-eslint/no-unused-private-class-members
			 */
			'no-unused-private-class-members': 'off',
			/**
			 * Rule: no-unused-vars (https://eslint.org/docs/latest/rules/no-unused-vars)
			 * Reason for disabling: Replaced by @typescript-eslint/no-unused-vars
			 */
			'no-unused-vars': 'off',
			/**
			 * Rule: no-use-before-define (https://eslint.org/docs/latest/rules/no-use-before-define)
			 * Reason for disabling: Replaced by @typescript-eslint/no-use-before-define
			 */
			'no-use-before-define': 'off',
			'no-useless-assignment': 'error',
			'no-useless-backreference': 'error',
			'no-useless-call': 'error',
			'no-useless-catch': 'error',
			'no-useless-computed-key': 'error',
			'no-useless-concat': 'error',
			/**
			 * Rule: no-useless-constructor (https://eslint.org/docs/latest/rules/no-useless-constructor)
			 * Reason for disabling: Replaced by @typescript-eslint/no-useless-constructor
			 */
			'no-useless-constructor': 'off',
			'no-useless-escape': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			/**
			 * Rule: no-void (https://eslint.org/docs/latest/rules/no-void)
			 * Reason for disabling: Conflicts with @typescript-eslint/no-floating-promises
			 */
			'no-void': 'off',
			'no-warning-comments': 'error',
			'no-with': 'error',
			'object-shorthand': 'error',
			/**
			 * Rule: one-var (https://eslint.org/docs/latest/rules/one-var)
			 * Reason for 'never': Enforces better readability
			 * Example with 'never':
			 * const a = 1;
			 * const b = 2;
			 * Example with 'always':
			 * const a = 1, b = 2;
			 */
			'one-var': ['error', 'never'],
			'operator-assignment': 'error',
			/**
			 * Rule: prefer-arrow-callback (https://eslint.org/docs/latest/rules/prefer-arrow-callback)
			 * Reason for disabling: Replaced by prettier
			 */
			'prefer-arrow-callback': 'off',
			'prefer-const': 'error',
			/**
			 * Rule: prefer-destructuring (https://eslint.org/docs/latest/rules/prefer-destructuring)
			 * Reason for disabling: Replaced by @typescript-eslint/prefer-destructuring
			 */
			'prefer-destructuring': 'off',
			'prefer-exponentiation-operator': 'error',
			'prefer-named-capture-group': 'error',
			'prefer-numeric-literals': 'error',
			'prefer-object-has-own': 'error',
			'prefer-object-spread': 'error',
			/**
			 * Rule: prefer-promise-reject-errors (https://eslint.org/docs/latest/rules/prefer-promise-reject-errors)
			 * Reason for disabling: Replaced by @typescript-eslint/prefer-promise-reject-errors
			 */
			'prefer-promise-reject-errors': 'off',
			'prefer-regex-literals': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'prefer-template': 'error',
			'preserve-caught-error': 'off',
			radix: 'error',
			'require-atomic-updates': 'error',
			/**
			 * Rule: require-await (https://eslint.org/docs/latest/rules/require-await)
			 * Reason for disabling: Replaced by @typescript-eslint/require-await
			 */
			'require-await': 'off',
			'require-unicode-regexp': 'error',
			'require-yield': 'error',
			/**
			 * Rule: sort-imports (https://eslint.org/docs/latest/rules/sort-imports)
			 * Reason for {ignoreDeclarationSort: true}: The sorting between 2 imports should be made on the library name, not
			 * their members
			 * Example of correct sorting:
			 * import b from 'a';
			 * import a from 'b';
			 */
			'sort-imports': ['error', {ignoreDeclarationSort: true}],
			/**
			 * Rule: sort-keys (https://eslint.org/docs/latest/rules/sort-keys)
			 * Reason for disabling: Keys in an object are often ordered logically and not alphabetically
			 */
			'sort-keys': 'off',
			/**
			 * Rule: sort-vars (https://eslint.org/docs/latest/rules/sort-vars)
			 * Reason for disabling: Not applicable when using "one-var: never"
			 */
			'sort-vars': 'off',
			strict: 'error',
			'symbol-description': 'error',
			'unicode-bom': 'error',
			'use-isnan': 'error',
			'valid-typeof': 'error',
			'vars-on-top': 'error',
			yoda: 'error',

			// https://typescript-eslint.io/rules/
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/array-type': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/ban-ts-comment': 'error',
			'@typescript-eslint/ban-tslint-comment': 'error',
			'@typescript-eslint/class-literal-property-style': 'error',
			/**
			 * Rule: @typescript-eslint/class-methods-use-this (https://typescript-eslint.io/rules/class-methods-use-this)
			 * Reason for disabling: It mandates that each method of a class either uses 'this' or is made static. This is not
			 * good because static method in JS are not very readable and this would thus encourage to write non-pure functions
			 */
			'@typescript-eslint/class-methods-use-this': 'off',
			'@typescript-eslint/consistent-generic-constructors': 'error',
			'@typescript-eslint/consistent-indexed-object-style': 'error',
			'@typescript-eslint/consistent-return': 'error',
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/consistent-type-definitions': 'error',
			'@typescript-eslint/consistent-type-exports': 'error',
			/**
			 * Rule: @typescript-eslint/consistent-type-imports (https://typescript-eslint.io/rules/consistent-type-imports)
			 * Reason for {fixStyle: 'inline-type-imports'}: It is better to always group imports together instead of importing types in a separate import
			 * Example with {fixStyle: 'inline-type-imports'}
			 * import {type A, B} from 'module';
			 * Example without {fixStyle: 'inline-type-imports'}
			 * import type {A} from 'module';
			 * import {B} from 'module';
			 */
			'@typescript-eslint/consistent-type-imports': ['error', {fixStyle: 'inline-type-imports'}],
			'@typescript-eslint/default-param-last': 'error',
			/**
			 * Rule: @typescript-eslint/dot-notation (https://typescript-eslint.io/rules/dot-notation)
			 * Reason for {allowIndexSignaturePropertyAccess: true}: Overridden by Tsconfig "noPropertyAccessFromIndexSignature",
			 * therefor it is better to show that actual value
			 */
			'@typescript-eslint/dot-notation': ['error', {allowIndexSignaturePropertyAccess: true}],
			/**
			 * Rule: @typescript-eslint/explicit-function-return-type (https://typescript-eslint.io/rules/explicit-function-return-type)
			 * Reason for {allowExpressions: true}: function expressions cannot be easily typed
			 * Example with {allowExpressions: true}
			 * const fn = () => {}
			 * Example without {allowExpressions: true}
			 * const fn = function func() {}
			 */
			'@typescript-eslint/explicit-function-return-type': ['error', {allowExpressions: true}],
			/**
			 * Rule: @typescript-eslint/explicit-member-accessibility (https://typescript-eslint.io/rules/explicit-member-accessibility)
			 * Reason for disabling: forces to add "public" to each public property, but that's unnecessary because it is the default value
			 */
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/init-declarations': 'error',
			'@typescript-eslint/max-params': 'error',
			/**
			 * Rule: @typescript-eslint/member-ordering (https://typescript-eslint.io/rules/member-ordering)
			 * Reason for customizing: The default ordering is not logical. Grouping fields and methods by accessibility and type is better
			 */
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
						'private-method',
					],
				},
			],
			'@typescript-eslint/method-signature-style': 'error',
			/**
			 * Rule: @typescript-eslint/naming-convention (https://typescript-eslint.io/rules/naming-convention)
			 * Reason for customizing: There is not one-size-fits-all. The global rule is "camelCase", but there are a few exceptions
			 */
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']}, // class, enum, interface, type, ...
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
			],
			'@typescript-eslint/no-array-constructor': 'error',
			'@typescript-eslint/no-array-delete': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'error',
			/**
			 * Rule: @typescript-eslint/no-confusing-void-expression (https://typescript-eslint.io/rules/no-confusing-void-expression)
			 * Reason for disabling: Too strict, it forces to always use curly braces in functions
			 * Example with disabled rule:
			 * fn().then(() => doSomething());
			 * Example with enabled rule:
			 * fn().then(() => { doSomething(); });
			 */
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-deprecated': 'error',
			'@typescript-eslint/no-dupe-class-members': 'error',
			'@typescript-eslint/no-duplicate-enum-values': 'error',
			'@typescript-eslint/no-duplicate-type-constituents': 'error',
			'@typescript-eslint/no-dynamic-delete': 'error',
			'@typescript-eslint/no-empty-function': 'error',
			'@typescript-eslint/no-empty-object-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-extra-non-null-assertion': 'error',
			/**
			 * Rule: @typescript-eslint/no-extraneous-class (https://typescript-eslint.io/rules/no-extraneous-class)
			 * Reason for {allowWithDecorator: true}: Classes that are used as decorators (e.g. @Injectable) are necessary even if they have no members
			 * Example with {allowWithDecorator: true}:
			 * @Injectable() MyService{}
			 * Example without {allowWithDecorator: true}:
			 * @Injectable() MyService{
			 *   something = undefined
			 * }
			 */
			'@typescript-eslint/no-extraneous-class': ['error', {allowWithDecorator: true}],
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-implied-eval': 'error',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-inferrable-types': 'error',
			/**
			 * Rule: @typescript-eslint/no-invalid-this (https://typescript-eslint.io/rules/no-invalid-this)
			 * Reason for disabling: Not recommended by ESLint as already covered by typescript compiler
			 */
			'@typescript-eslint/no-invalid-this': 'off',
			'@typescript-eslint/no-invalid-void-type': 'error',
			'@typescript-eslint/no-loop-func': 'error',
			/**
			 * Rule: @typescript-eslint/no-magic-numbers (https://typescript-eslint.io/rules/no-magic-numbers)
			 * Reason for ignoring -1, 0, 1: These values are often used and their meaning is usually clear
			 * Reason for enabling ignoreReadonlyClassProperties: Readonly class properties are often used as constants and should not trigger this rule
			 * Example with {ignoreReadonlyClassProperties: true};
			 * private readonly maxRetries = 5;
			 */
			'@typescript-eslint/no-magic-numbers': ['error', {ignore: [-1, 0, 1], ignoreReadonlyClassProperties: true}],
			'@typescript-eslint/no-meaningless-void-operator': 'error',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/no-misused-spread': 'error',
			'@typescript-eslint/no-mixed-enums': 'error',
			'@typescript-eslint/no-namespace': 'error',
			'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-redeclare': 'error',
			'@typescript-eslint/no-redundant-type-constituents': 'error',
			'@typescript-eslint/no-require-imports': 'error',
			'@typescript-eslint/no-restricted-imports': 'error',
			'@typescript-eslint/no-restricted-types': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-this-alias': 'error',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-template-expression': 'error',
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-unnecessary-type-constraint': 'error',
			'@typescript-eslint/no-unnecessary-type-conversion': 'error',
			'@typescript-eslint/no-unnecessary-type-parameters': 'error',
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-declaration-merging': 'error',
			'@typescript-eslint/no-unsafe-enum-comparison': 'error',
			'@typescript-eslint/no-unsafe-function-type': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-unsafe-type-assertion': 'error',
			'@typescript-eslint/no-unsafe-unary-minus': 'error',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/no-unused-private-class-members': 'off',
			'@typescript-eslint/no-unused-vars': ['error'],
			/**
			 * Rule: @typescript-eslint/no-use-before-define (https://typescript-eslint.io/rules/no-use-before-define)
			 * Reason for {functions: false}: Functions are hoisted so they can be used before they are defined
			 * Example with {functions: false}:
			 * fn();
			 * function fn() {}
			 */
			'@typescript-eslint/no-use-before-define': ['error', {functions: false}],
			'@typescript-eslint/no-useless-constructor': 'error',
			'@typescript-eslint/no-useless-empty-export': 'error',
			'@typescript-eslint/no-useless-default-assignment': 'off',
			'@typescript-eslint/no-wrapper-object-types': 'error',
			'@typescript-eslint/non-nullable-type-assertion-style': 'error',
			'@typescript-eslint/only-throw-error': 'error',
			'@typescript-eslint/parameter-properties': 'error',
			'@typescript-eslint/prefer-as-const': 'error',
			/**
			 * Rule: @typescript-eslint/prefer-destructuring (https://typescript-eslint.io/rules/prefer-destructuring)
			 * Reason for {array: false}: This is difficult to read when the second or later list elements are accessed.
			 * Example with {array: false}:
			 * const third = arr[2];
			 * Example without {array: false}:
			 * const [, , third] = arr;
			 * Reason for {enforceForRenamedProperties: false}: Destructuring while renaming properties is not readable
			 * Example with {enforceForRenamedProperties: false}:
			 * const {veryLongPropertyName: shortName} = obj;
			 * Example without {enforceForRenamedProperties: false}:
			 * const veryLongPropertyName = obj.shortName;
			 */
			'@typescript-eslint/prefer-destructuring': ['error', {array: false}, {enforceForRenamedProperties: false}],
			'@typescript-eslint/prefer-enum-initializers': 'error',
			'@typescript-eslint/prefer-find': 'error',
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-includes': 'error',
			'@typescript-eslint/prefer-literal-enum-member': 'error',
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/prefer-promise-reject-errors': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			/**
			 * Rule: @typescript-eslint/prefer-readonly-parameter-types (https://typescript-eslint.io/rules/prefer-readonly-parameter-types)
			 * Reason for disabling: Causes ESLint to crash
			 */
			'@typescript-eslint/prefer-readonly-parameter-types': 'off',
			'@typescript-eslint/prefer-reduce-type-parameter': 'error',
			'@typescript-eslint/prefer-regexp-exec': 'error',
			'@typescript-eslint/prefer-return-this-type': 'error',
			'@typescript-eslint/prefer-string-starts-ends-with': 'error',
			'@typescript-eslint/promise-function-async': 'error',
			'@typescript-eslint/related-getter-setter-pairs': 'error',
			'@typescript-eslint/require-array-sort-compare': 'error',
			'@typescript-eslint/require-await': 'error',
			'@typescript-eslint/restrict-plus-operands': 'error',
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/return-await': 'error',
			'@typescript-eslint/strict-boolean-expressions': 'error',
			'@typescript-eslint/strict-void-return': 'error',
			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			'@typescript-eslint/triple-slash-reference': 'error',
			/**
			 * Rule: @typescript-eslint/unbound-method (https://typescript-eslint.io/rules/unbound-method)
			 * Reason for {ignoreStatic: true}: Static methods are not bound to an instance so it is safe to use them unbound
			 * Example with {ignoreStatic: true}:
			 * const fn = SomeClass.staticMethod;
			 * Example without {ignoreStatic: true}:
			 * const fn = someInstance.staticMethod.bind(this);
			 */
			'@typescript-eslint/unbound-method': ['error', {ignoreStatic: true}],
			'@typescript-eslint/unified-signatures': 'error',
			'@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

			// https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin/docs/rules
			'@angular-eslint/component-class-suffix': 'error',
			/**
			 * Rule: @angular-eslint/component-max-inline-declarations (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/component-max-inline-declarations.md)
			 * Reason for {template: 0, styles: 0, animations: 0}: Templates, styles and animations should be external
			 */
			'@angular-eslint/component-max-inline-declarations': ['error', {template: 0, styles: 0, animations: 0}],
			'@angular-eslint/consistent-component-styles': 'error',
			'@angular-eslint/contextual-decorator': 'error',
			'@angular-eslint/contextual-lifecycle': 'error',
			'@angular-eslint/directive-class-suffix': 'error',
			'@angular-eslint/no-async-lifecycle-method': 'error',
			'@angular-eslint/no-attribute-decorator': 'error',
			'@angular-eslint/no-developer-preview': 'error',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
			'@angular-eslint/no-empty-lifecycle-method': 'error',
			'@angular-eslint/no-experimental': 'error',
			'@angular-eslint/no-forward-ref': 'error',
			'@angular-eslint/no-input-prefix': 'error',
			'@angular-eslint/no-input-rename': 'error',
			'@angular-eslint/no-inputs-metadata-property': 'error',
			'@angular-eslint/no-lifecycle-call': 'error',
			'@angular-eslint/no-output-native': 'error',
			'@angular-eslint/no-output-on-prefix': 'error',
			'@angular-eslint/no-output-rename': 'error',
			'@angular-eslint/no-outputs-metadata-property': 'error',
			'@angular-eslint/no-pipe-impure': 'error',
			'@angular-eslint/no-queries-metadata-property': 'error',
			'@angular-eslint/no-uncalled-signals': 'error',
			'@angular-eslint/pipe-prefix': 'error',
			'@angular-eslint/prefer-host-metadata-property': 'error',
			'@angular-eslint/prefer-inject': 'error',
			/**
			 * Rule: @angular-eslint/prefer-on-push-component-change-detection (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-on-push-component-change-detection.md)
			 * Reason for disabling: OnPush is not always the best choice, especially with signals
			 */
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@angular-eslint/prefer-output-emitter-ref': 'error',
			'@angular-eslint/prefer-output-readonly': 'error',
			'@angular-eslint/prefer-signal-model': 'error',
			'@angular-eslint/prefer-signals': 'error',
			'@angular-eslint/prefer-standalone': 'error',
			'@angular-eslint/relative-url-prefix': 'error',
			'@angular-eslint/require-lifecycle-on-prototype': 'error',
			'@angular-eslint/require-localize-metadata': 'error',
			'@angular-eslint/runtime-localize': 'error',
			'@angular-eslint/sort-keys-in-type-decorator': 'error',
			'@angular-eslint/sort-lifecycle-methods': 'error',
			'@angular-eslint/use-component-selector': 'error',
			'@angular-eslint/use-component-view-encapsulation': 'error',
			'@angular-eslint/use-injectable-provided-in': 'error',
			'@angular-eslint/use-lifecycle-interface': 'error',
			'@angular-eslint/use-pipe-transform-interface': 'error',
		},
	},
	{
		files: ['**/*.spec.ts'],
		plugins: {
			'@typescript-eslint': plugin,
			'@angular-eslint': tsPlugin,
			'@angular-eslint/template': templatePlugin, // because tests can have inline template
		},
		rules: {
			/**
			 * Rule: max-classes-per-file (https://eslint.org/docs/latest/rules/max-classes-per-file)
			 * Reason for disabling: Tests may define mock classes
			 */
			'max-classes-per-file': 'off',
			/**
			 * Rule: max-lines (https://eslint.org/docs/latest/rules/max-lines)
			 * Reason for disabling: Tests can be very long because of setup and many test cases
			 */
			'max-lines': 'off',
			/**
			 * Rule: max-lines-per-function (https://eslint.org/docs/latest/rules/max-lines-per-function)
			 * Reason for disabling: Each describe block is a function and can be very long because of setup and many test cases
			 */
			'max-lines-per-function': 'off',
			/**
			 * Rule: max-statements (https://eslint.org/docs/latest/rules/max-statements)
			 * Reason for disabling: Each test case is a statement and there can be many test cases in a single "describe" block
			 */
			'max-statements': 'off',
			/**
			 * Rule: @angular-eslint/component-max-inline-declarations (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/component-max-inline-declarations.md)
			 * Reason for disabling: Mock components are often used in tests and they use inline declarations
			 */
			'@angular-eslint/component-max-inline-declarations': 'off',
			/**
			 * Rule: @angular-eslint/use-component-selector (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/use-component-selector.md)
			 * Reason for disabling: Mock component don't need a selector, and it's better to keep them simple
			 */
			'@angular-eslint/use-component-selector': 'off',
			/**
			 * Rule: @typescript-eslint/consistent-type-imports (https://typescript-eslint.io/rules/consistent-type-imports)
			 * Reason for {disallowTypeAnnotations: false}: In tests, types are often used in type annotations (e.g. for spies) so it's better to allow type imports in type annotations
			 */
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{fixStyle: 'inline-type-imports', disallowTypeAnnotations: false},
			],
			/**
			 * Rule: @typescript-eslint/init-declarations (https://typescript-eslint.io/rules/init-declarations)
			 * Reason for disabling: Variables are often initialized in beforeEach blocks
			 */
			'@typescript-eslint/init-declarations': 'off',
			/**
			 * Rule: @typescript-eslint/no-empty-function (https://typescript-eslint.io/rules/no-empty-function)
			 * Reason for disabling: Test mocks may be empty functions
			 */
			'@typescript-eslint/no-empty-function': 'off',
			/**
			 * Rule: @typescript-eslint/no-magic-numbers (https://typescript-eslint.io/rules/no-magic-numbers)
			 * Reason for disabling: Test cases often use magic numbers to assert values
			 */
			'@typescript-eslint/no-magic-numbers': 'off',
			/**
			 * Rule: @typescript-eslint/no-unsafe-call (https://typescript-eslint.io/rules/no-unsafe-call)
			 * Reason for disabling: `fixture.nativeElement` is typed `any`, triggering this rule prevents its usage
			 */
			'@typescript-eslint/no-unsafe-call': 'off',
			/**
			 * Rule: @typescript-eslint/no-unsafe-call (https://typescript-eslint.io/rules/no-unsafe-call)
			 * Reason for disabling: `fixture.nativeElement` is typed `any`, triggering this rule prevents its usage
			 */
			'@typescript-eslint/no-unsafe-member-access': 'off',
			/**
			 * Rule: @typescript-eslint/no-unsafe-type-assertion (https://typescript-eslint.io/rules/no-unsafe-type-assertion)
			 * Reason for disabling: `fixture.nativeElement` is typed `any`, triggering this rule prevents its usage
			 */
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			/**
			 * Rule: @typescript-eslint/unbound-method (https://typescript-eslint.io/rules/unbound-method)
			 * Reason for disabling: `toHaveBeenCalled` and similar matchers are always called on unbound methods
			 * Example with disabled rule:
			 * expect(someSpy).toHaveBeenCalled();
			 * Example with enabled rule:
			 * expect(someSpy.bind(this)).toHaveBeenCalled();
			 */
			'@typescript-eslint/unbound-method': 'off',
		},
	},
	{
		files: ['**/*.html'],
		plugins: {
			'@angular-eslint/template': templatePlugin,
		},
		languageOptions: {
			parser: templateParser,
		},
		rules: {
			// https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template/docs/rules
			'@angular-eslint/template/alt-text': 'error',
			'@angular-eslint/template/attributes-order': 'error',
			'@angular-eslint/template/banana-in-box': 'error',
			'@angular-eslint/template/button-has-type': 'error',
			'@angular-eslint/template/click-events-have-key-events': 'error',
			'@angular-eslint/template/conditional-complexity': 'error',
			'@angular-eslint/template/cyclomatic-complexity': 'error',
			'@angular-eslint/template/elements-content': 'error',
			'@angular-eslint/template/eqeqeq': 'error',
			/**
			 * Rule: @angular-eslint/template/i18n (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/rules/i18n.ts)
			 * Reason for disabling: Angular Internationalization is not used
			 */
			'@angular-eslint/template/i18n': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'error',
			'@angular-eslint/template/label-has-associated-control': 'error',
			'@angular-eslint/template/mouse-events-have-key-events': 'error',
			'@angular-eslint/template/no-any': 'error',
			'@angular-eslint/template/no-autofocus': 'error',
			/**
			 * Rule: @angular-eslint/template/no-call-expression (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/rules/no-call-expression.ts)
			 * Reason for disabling: Not compatible with @angular-eslint/prefer-signals
			 */
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/no-distracting-elements': 'error',
			'@angular-eslint/template/no-duplicate-attributes': 'error',
			'@angular-eslint/template/no-inline-styles': 'error',
			'@angular-eslint/template/no-interpolation-in-attributes': 'error',
			'@angular-eslint/template/no-negated-async': 'error',
			'@angular-eslint/template/no-positive-tabindex': 'error',
			'@angular-eslint/template/prefer-contextual-for-variables': 'error',
			'@angular-eslint/template/prefer-control-flow': 'error',
			'@angular-eslint/template/prefer-ngsrc': 'error',
			'@angular-eslint/template/prefer-self-closing-tags': 'error',
			'@angular-eslint/template/prefer-static-string-properties': 'error',
			'@angular-eslint/template/role-has-required-aria': 'error',
			'@angular-eslint/template/table-scope': 'error',
			'@angular-eslint/template/use-track-by-function': 'error',
			'@angular-eslint/template/valid-aria': 'error',
		},
	},
	{
		files: ['**/index.html'],
		rules: {
			/**
			 * Rule: @angular-eslint/template/no-inline-styles (https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/rules/no-inline-styles.ts)
			 * Reason for disabling: Oblique adds inline styles to display unsupported browser in index.html. This is necessary so that the error messages are displayed even if the loading of external resources is blocked.
			 */
			'@angular-eslint/template/no-inline-styles': 'off',
		},
	},
];
