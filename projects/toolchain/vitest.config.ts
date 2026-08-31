import {defineConfig} from 'vitest/config';
import {resolve} from 'node:path';

export default defineConfig({
	cacheDir: '.vitecache',
	test: {
		watch: false,
		include: ['src/**/*.spec.ts'],
		globals: true,
		coverage: {
			enabled: true,
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: resolve(__dirname, '../../coverage/toolchain'),
			include: ['src/**/*.ts'],
			exclude: [
				'**/*.spec.ts',
				'**/index.ts',
				'**/types.ts',
				'src/schematics/test-utils.ts',
				'src/logger/**/*.ts',
				'src/**/mock/*',
			],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
