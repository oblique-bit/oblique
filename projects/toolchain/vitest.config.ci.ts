import {defineConfig, mergeConfig} from 'vitest/config';
import baseConfig from './vitest.config';
import {resolve} from 'node:path';

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			reporters: ['default', 'junit'],
			outputFile: {
				junit: resolve(__dirname, '../../coverage/sqr.xml'),
			},
		},
	})
);
