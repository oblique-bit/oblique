// @ts-check
export default [
	{
		files: ['projects/toolchain/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off', // needs strictNullChecks
			'@typescript-eslint/no-unnecessary-condition': 'off', // needs strictNullChecks
			'@typescript-eslint/prefer-nullish-coalescing': 'off', // needs strictNullChecks
			'@typescript-eslint/strict-boolean-expressions': 'off', // needs strictNullChecks
			'default-case': 'off', // covered by noImplicitReturns
		},
	},
	{
		files: ['projects/toolchain/src/schematics/**/*.ts'],
		rules: {
			// triggers false positive on
			// 	return (tree: Tree, context: SchematicContext) => {
			// 		return chain([])(tree, context);
			// };
			'@typescript-eslint/promise-function-async': 'off',
		},
	},
];
