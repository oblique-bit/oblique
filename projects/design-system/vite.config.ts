import path from 'node:path';
import {defineConfig} from 'vite';
import {globSync} from 'glob';
import dts from 'vite-plugin-dts';

export function getLibInputs(): Record<string, string> {
	return {
		index: path.resolve(__dirname, 'src/lib/index.ts'),
		...Object.fromEntries(
			globSync('src/lib/*/index.ts').map(file => {
				const parse = path.parse(path.relative('src', file));
				return [path.join(parse.dir, parse.name), path.resolve(__dirname, file)];
			})
		),
	};
}

export default defineConfig({
	build: {
		outDir: path.resolve(__dirname, '../../dist/design-system'),
		emptyOutDir: true,

		rollupOptions: {
			input: getLibInputs(),
			external: ['lit'],
			preserveEntrySignatures: 'strict',
			output: {
				format: 'es',
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js',
			},
		},
	},
	plugins: [
		dts({
			entryRoot: 'src',
			tsconfigPath: 'tsconfig.lib.json',
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/**/*.spec.ts'],
		}),
	],
});
