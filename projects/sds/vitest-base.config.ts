import {defineConfig} from 'vitest/config';

/**
 * Vitest configuration for the `sds` unit tests, loaded through the `runnerConfig` option of the
 * `@angular/build:unit-test` builder.
 *
 * The builder has no option for the hook timeout, so it has to be set here. Several specs compile large
 * component trees in `beforeEach` (the slowest takes ~8s locally), which exceeds Vitest's 10s default on
 * slower CI machines and fails the suite with `Hook timed out in 10000ms`.
 */
export default defineConfig({
	test: {
		hookTimeout: 30000,
		maxWorkers: 2,
	},
});
