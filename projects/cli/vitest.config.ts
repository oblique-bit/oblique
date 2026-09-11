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
			reportsDirectory: resolve(__dirname, '../../coverage/cli'),
			include: ['src/**/*.ts'],
			exclude: ['**/*.spec.ts', '**/index.ts'],
			thresholds: {
				'src/new/ob-new.ts': {
					statements: 95,
					branches: 100,
					functions: 100,
					lines: 95,
				},
				'src/new/ob-new.model.ts': {statements: 100, branches: 100, functions: 100, lines: 100},
				'src/update/ob-update.ts': {
					statements: 87,
					branches: 63,
					functions: 100,
					lines: 87,
				},
				'src/update/ob-update.model.ts': {statements: 100, branches: 100, functions: 100, lines: 100},
				'src/utils/cli-utils.ts': {
					statements: 97,
					branches: 91,
					functions: 100,
					lines: 97,
				},
				'src/utils/ob-cli.model.ts': {statements: 100, branches: 100, functions: 100, lines: 100},
				'src/utils/ob-configure-command.ts': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
			},
		},
	},
});
