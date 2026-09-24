import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';
import {resolve} from 'node:path';

export default defineConfig({
	cacheDir: '.vitecache',
	test: {
		include: ['src/lib/**/*.spec.ts'],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{browser: 'chromium'}],
			headless: true,
		},
		coverage: {
			enabled: true,
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: resolve(__dirname, '../../coverage/design-system'),
			include: ['src/lib/**/*.ts'],
			exclude: ['**/*.spec.ts', '**/index.ts'],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
