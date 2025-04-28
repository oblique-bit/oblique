// @ts-check
import {config, plugin, parser} from 'typescript-eslint';
import {processInlineTemplates, templatePlugin, tsPlugin, templateParser} from 'angular-eslint';
import obliqueEslintConfig from './projects/oblique/eslint.project-config.mjs';
import cliEslintConfig from './projects/cli/eslint.project-config.mjs';
import designSystemEslintConfig from './projects/design-system/eslint.project-config.mjs';
import sandboxEslintConfig from './projects/sandbox/eslint.project-config.mjs';
import sandboxSsrEslintConfig from './projects/sandbox-ssr/eslint.project-config.mjs';
import sdsEslintConfig from './projects/sds/eslint.project-config.mjs';
import serviceNavigationWebComponentEslintConfig from './projects/service-navigation-web-component/eslint.project-config.mjs';

export default config(
	{
		files: ['**/*.ts'],
		plugins: {
			'@typescript-eslint': plugin,
			'@angular-eslint': tsPlugin
		},
		processor: processInlineTemplates,
		languageOptions: {
			parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			},
			sourceType: 'module'
		},
		rules: {
			// https://eslint.org/docs/latest/rules
			'accessor-pairs': 'error',
			'array-callback-return': 'error',
			'arrow-body-style': 'off', // covered by prettier
			'block-scoped-var': 'error',
			camelcase: 'off', // covered by @typescript-eslint/naming-convention
			'capitalized-comments': 'off', // not important
			'class-methods-use-this': 'off', // covered by @typescript-eslint
			complexity: 'error',
			'consistent-return': 'off', // covered by @typescript-eslint
			'consistent-this': 'error',
			'constructor-super': 'error',
			curly: 'error',
			'default-case': 'error',
			'default-case-last': 'error',
			'default-param-last': 'off', // covered by @typescript-eslint
			'dot-notation': 'off', // covered by @typescript-eslint
			eqeqeq: 'error',
			'for-direction': 'error',
			'func-name-matching': 'error',
			'func-names': ['error', 'as-needed'],
			'func-style': 'off', // exported functions are declarative, other ones are mostly expressive
			'getter-return': 'error',
			'grouped-accessor-pairs': 'error',
			'guard-for-in': 'error',
			'id-denylist': 'error',
			'id-length': 'error',
			'id-match': 'error',
			'init-declarations': 'off', // covered by @typescript-eslint
			'logical-assignment-operators': 'error',
			'max-classes-per-file': 'error',
			'max-depth': 'error',
			'max-lines': 'error',
			'max-lines-per-function': ['error', {max: 35}],
			'max-nested-callbacks': 'error',
			'max-params': 'off', // covered by @typescript-eslint
			'max-statements': ['error', {max: 15}],
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
						'ViewChildren'
					]
				}
			],
			'no-alert': 'error',
			'no-array-constructor': 'off', // covered by @typescript-eslint
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
			'no-console': ['error', {allow: ['info', 'warn', 'error']}],
			'no-continue': 'error',
			'no-control-regex': 'error',
			'no-debugger': 'error',
			'no-delete-var': 'error',
			'no-div-regex': 'error',
			'no-dupe-args': 'error',
			'no-dupe-class-members': 'off', // covered by @typescript-eslint
			'no-dupe-else-if': 'error',
			'no-dupe-keys': 'error',
			'no-duplicate-case': 'error',
			'no-duplicate-imports': ['error', {includeExports: true}],
			'no-else-return': 'error',
			'no-empty': 'error',
			'no-empty-character-class': 'error',
			'no-empty-function': 'off', // covered by @typescript-eslint
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
			'no-implied-eval': 'off', // covered by @typescript-eslint
			'no-import-assign': 'error',
			'no-inline-comments': 'off', // often the best place for comments
			'no-inner-declarations': 'error',
			'no-invalid-regexp': 'error',
			'no-invalid-this': 'off', // covered by @typescript-eslint
			'no-irregular-whitespace': 'error',
			'no-iterator': 'error',
			'no-label-var': 'error',
			'no-labels': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-loop-func': 'off', // covered by @typescript-eslint
			'no-loss-of-precision': 'error',
			'no-magic-numbers': 'off', // covered by @typescript-eslint
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
			'no-plusplus': 'off', // useful feature
			'no-promise-executor-return': 'error',
			'no-proto': 'error',
			'no-prototype-builtins': 'error',
			'no-redeclare': 'off', // covered by @typescript-eslint
			'no-regex-spaces': 'error',
			'no-restricted-exports': 'error',
			'no-restricted-globals': 'error',
			'no-restricted-imports': 'off', // covered by @typescript-eslint
			'no-restricted-properties': 'error',
			'no-restricted-syntax': 'error',
			'no-return-assign': 'error',
			'no-script-url': 'error',
			'no-self-assign': 'error',
			'no-self-compare': 'error',
			'no-setter-return': 'error',
			'no-sequences': 'error',
			'no-shadow': 'off', // covered by @typescript-eslint
			'no-shadow-restricted-names': 'error',
			'no-sparse-arrays': 'error',
			'no-template-curly-in-string': 'error',
			'no-ternary': 'off', // useful feature
			'no-this-before-super': 'error',
			'no-throw-literal': 'off', // covered by @typescript-eslint
			'no-undef': 'off', // prevent usage of global functions like 'console', or 'describe'
			'no-unexpected-multiline': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-undef-init': 'error',
			'no-undefined': 'off', // completely prevents the usage of undefined
			'no-underscore-dangle': 'error',
			'no-unneeded-ternary': 'error',
			'no-unreachable': 'error',
			'no-unreachable-loop': 'error',
			'no-unsafe-finally': 'error',
			'no-unsafe-negation': 'error',
			'no-unsafe-optional-chaining': 'error',
			'no-unused-expressions': 'off', // covered by @typescript-eslint
			'no-unused-labels': 'error',
			'no-unused-private-class-members': 'error',
			'no-unused-vars': 'off', // covered by @typescript-eslint
			'no-use-before-define': 'off', // covered by @typescript-eslint
			'no-useless-assignment': 'error',
			'no-useless-backreference': 'error',
			'no-useless-call': 'error',
			'no-useless-catch': 'error',
			'no-useless-computed-key': 'error',
			'no-useless-concat': 'error',
			'no-useless-constructor': 'off', // covered by @typescript-eslint
			'no-useless-escape': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			'no-void': 'off', // not compatible with @typescript-eslint/no-floating-promises
			'no-warning-comments': 'error',
			'no-with': 'error',
			'object-shorthand': 'error',
			'one-var': ['error', 'never'],
			'operator-assignment': 'error',
			'prefer-arrow-callback': 'off', // covered by prettier
			'prefer-const': 'error',
			'prefer-destructuring': 'off', // covered by @typescript-eslint
			'prefer-exponentiation-operator': 'error',
			'prefer-named-capture-group': 'error',
			'prefer-numeric-literals': 'error',
			'prefer-object-has-own': 'off', // need lib: es2022
			'prefer-object-spread': 'error',
			'prefer-promise-reject-errors': 'off', // covered by @typescript-eslint
			'prefer-regex-literals': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'prefer-template': 'error',
			radix: 'error',
			'require-atomic-updates': 'error',
			'require-await': 'off', // covered by @typescript-eslint
			'require-unicode-regexp': 'error',
			'require-yield': 'error',
			'sort-imports': ['error', {ignoreDeclarationSort: true}],
			'sort-keys': 'off', // keys are often logically ordered
			'sort-vars': 'off', // irrelevant with one-var: never
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
			'@typescript-eslint/class-methods-use-this': 'off', // would encourage non-pure function
			'@typescript-eslint/consistent-generic-constructors': 'error',
			'@typescript-eslint/consistent-indexed-object-style': 'error',
			'@typescript-eslint/consistent-return': 'error',
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/consistent-type-definitions': 'error',
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', {fixStyle: 'inline-type-imports'}],
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/dot-notation': ['error', {allowIndexSignaturePropertyAccess: true}],
			'@typescript-eslint/explicit-function-return-type': ['error', {allowExpressions: true}],
			'@typescript-eslint/explicit-member-accessibility': 'off', // public is the default value
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/init-declarations': 'error',
			'@typescript-eslint/max-params': 'error',
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
			], // need tweaking https://typescript-eslint.io/rules/member-ordering
			'@typescript-eslint/method-signature-style': 'error',
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']}
			],
			'@typescript-eslint/no-array-constructor': 'error',
			'@typescript-eslint/no-array-delete': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'off', // forces curly braces everywhere
			'@typescript-eslint/no-deprecated': 'error',
			'@typescript-eslint/no-dupe-class-members': 'error',
			'@typescript-eslint/no-duplicate-enum-values': 'error',
			'@typescript-eslint/no-duplicate-type-constituents': 'error',
			'@typescript-eslint/no-dynamic-delete': 'error',
			'@typescript-eslint/no-empty-function': 'error',
			'@typescript-eslint/no-empty-object-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-extra-non-null-assertion': 'error',
			'@typescript-eslint/no-extraneous-class': ['error', {allowWithDecorator: true}],
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-implied-eval': 'error',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-inferrable-types': 'error',
			'@typescript-eslint/no-invalid-this': 'off', // covered by typescript compiler (see @typescript-eslint doc)
			'@typescript-eslint/no-invalid-void-type': 'error', // might need allowAsThisParameter: true
			'@typescript-eslint/no-loop-func': 'error',
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
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-template-expression': 'error',
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-unnecessary-type-constraint': 'error',
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
			'@typescript-eslint/no-unused-vars': ['error', {caughtErrors: 'none'}],
			'@typescript-eslint/no-use-before-define': ['error', {functions: false}],
			'@typescript-eslint/no-useless-constructor': 'error',
			'@typescript-eslint/no-useless-empty-export': 'error',
			'@typescript-eslint/no-wrapper-object-types': 'error',
			'@typescript-eslint/non-nullable-type-assertion-style': 'error',
			'@typescript-eslint/only-throw-error': 'error',
			'@typescript-eslint/parameter-properties': 'error',
			'@typescript-eslint/prefer-as-const': 'error',
			'@typescript-eslint/prefer-destructuring': ['error', {object: true}, {enforceForRenamedProperties: false}],
			'@typescript-eslint/prefer-enum-initializers': 'error',
			'@typescript-eslint/prefer-find': 'error',
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-includes': 'error',
			'@typescript-eslint/prefer-literal-enum-member': 'error',
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/prefer-promise-reject-errors': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/prefer-readonly-parameter-types': 'off', // trigger errors
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
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			'@typescript-eslint/triple-slash-reference': 'error',
			'@typescript-eslint/typedef': 'error',
			'@typescript-eslint/unbound-method': ['error', {ignoreStatic: true}],
			'@typescript-eslint/unified-signatures': 'error',
			'@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

			// https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin/docs/rules
			'@angular-eslint/component-class-suffix': 'error',
			'@angular-eslint/component-max-inline-declarations': ['error', {template: 0, styles: 0, animations: 1}],
			'@angular-eslint/consistent-component-styles': 'error',
			'@angular-eslint/contextual-decorator': 'error',
			'@angular-eslint/contextual-lifecycle': 'error',
			'@angular-eslint/directive-class-suffix': 'error',
			'@angular-eslint/no-async-lifecycle-method': 'error',
			'@angular-eslint/no-attribute-decorator': 'error',
			'@angular-eslint/no-conflicting-lifecycle': 'error',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
			'@angular-eslint/no-empty-lifecycle-method': 'error',
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
			'@angular-eslint/pipe-prefix': 'error',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off', // no need for that
			'@angular-eslint/prefer-output-readonly': 'error',
			'@angular-eslint/prefer-signals': 'error',
			'@angular-eslint/prefer-standalone': 'error',
			'@angular-eslint/relative-url-prefix': 'error',
			'@angular-eslint/require-lifecycle-on-prototype': 'error',
			'@angular-eslint/require-localize-metadata': 'error',
			'@angular-eslint/runtime-localize': 'error',
			'@angular-eslint/sort-lifecycle-methods': 'error',
			'@angular-eslint/use-component-selector': 'error',
			'@angular-eslint/use-component-view-encapsulation': 'error',
			'@angular-eslint/use-injectable-provided-in': 'error',
			'@angular-eslint/use-lifecycle-interface': 'error',
			'@angular-eslint/use-pipe-transform-interface': 'error'
		}
	},
	{
		files: ['**/*.spec.ts'],
		plugins: {
			'@typescript-eslint': plugin,
			'@angular-eslint': tsPlugin,
			'@angular-eslint/template': templatePlugin // because tests can have inline template
		},
		rules: {
			'max-classes-per-file': 'off', // allow mock components
			'max-lines': 'off', // with 1 test file per file, it can be very long
			'max-lines-per-function': 'off', // describe will be much longer
			'max-statements': 'off', // each test case is a statement
			'@angular-eslint/component-max-inline-declarations': 'off', // mock component use inline declarations
			'@angular-eslint/use-component-selector': 'off', // mocks may not have a selector
			'@typescript-eslint/consistent-type-imports': ['error', {fixStyle: 'inline-type-imports', disallowTypeAnnotations: false}],
			'@typescript-eslint/init-declarations': 'off', // property are initialized in beforeEach
			'@typescript-eslint/no-empty-function': 'off', // mocks may be empty
			'@typescript-eslint/no-floating-promises': 'off', // lots of jest function returns a promise that we don't care about
			'@typescript-eslint/no-magic-numbers': 'off', // useful at assert the number of elements
			'@typescript-eslint/no-unsafe-call': 'off', // because fixture.nativeElement is typed `any`
			'@typescript-eslint/no-unsafe-member-access': 'off', // because fixture.nativeElement is typed `any`
			'@typescript-eslint/no-unsafe-type-assertion': 'off', // nativeElement is typed with any
			'@typescript-eslint/unbound-method': 'off' // toHaveBeenCalled is used on unbound method
		}
	},
	{
		files: ['**/*.html'],
		plugins: {
			'@angular-eslint/template': templatePlugin
		},
		languageOptions: {
			parser: templateParser
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
			'@angular-eslint/template/i18n': 'off', // feature is not used
			'@angular-eslint/template/interactive-supports-focus': 'error',
			'@angular-eslint/template/label-has-associated-control': 'error',
			'@angular-eslint/template/mouse-events-have-key-events': 'error',
			'@angular-eslint/template/no-any': 'error',
			'@angular-eslint/template/no-autofocus': 'error',
			'@angular-eslint/template/no-call-expression': 'off', // not compatible with @angular-eslint/prefer-signals
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
			'@angular-eslint/template/valid-aria': 'error'
		}
	},
	{
		files: ['**/index.html'],
		rules: {
			// special case for index.html
			'@angular-eslint/template/no-inline-styles': 'off'
		}
	},
	{
		files: ['scripts/shared/log.ts'],
		rules: {
			// special case
			'no-console': ['error', {allow: ['log']}]
		}
	},
	{
		files: ['scripts/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/max-params': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'no-implicit-coercion': 'off',
			'require-unicode-regexp': 'off'
		}
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			// rules that are not respected
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'func-names': 'off'
		}
	},
	{
		files: ['projects/oblique/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'variable', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'variable', format: ['PascalCase'], filter: '^(?:CookiesMock|ObTIconConfig|ObTBreadcrumbConfig|ObliquePackage)$'},
				{selector: 'objectLiteralProperty', format: ['UPPER_CASE'], filter: '^(?:MAT|STEPPER)|^(?:ABN|TEST|DEV|REF|LOCAL)$'},
				{selector: 'objectLiteralProperty', format: ['UPPER_CASE'], filter: '^(?:LABEL_FORMATTER|HIGHLIGHT|VARIANT)'},
				{selector: 'objectLiteralMethod', format: null, modifiers: ['requiresQuotes']},
				{selector: 'typeProperty', format: ['UPPER_CASE'], filter: '^(?:MAT|STEPPER)'},
				{selector: 'typeAlias', format: ['camelCase'], filter: '^versionFunc$'},
				{selector: 'parameter', format: ['PascalCase'], filter: '^CookiesMock$'},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']},
				{selector: 'import', format: null}
			]
		}
	},
	{
		files: ['projects/sds/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']}
			]
		}
	},
	{
		files: ['projects/sandbox/**/*.ts'],
		rules: {
			// these exceptions need to be in the root configuration file for IntelliJ to take them into consideration
			'@typescript-eslint/naming-convention': [
				'error',
				{selector: 'default', format: ['camelCase']},
				{selector: 'typeLike', format: ['PascalCase']},
				{selector: 'enumMember', format: ['UPPER_CASE']},
				{selector: 'objectLiteralProperty', format: null, modifiers: ['requiresQuotes']},
				// rules that are not respected
				{selector: 'property', format: ['camelCase', 'snake_case']},
				{selector: 'classProperty', format: ['camelCase', 'UPPER_CASE']}
			]
		}
	},
	...obliqueEslintConfig,
	...cliEslintConfig,
	...designSystemEslintConfig,
	...sandboxEslintConfig,
	...sandboxSsrEslintConfig,
	...sdsEslintConfig,
	...serviceNavigationWebComponentEslintConfig
);
