globalThis.ngJest = {
	skipNgcc: true,
};

import coverageConfig from './jest.config.coverage.js';

export default {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	transformIgnorePatterns: ['node_modules/?!(@angular/common/locales|@angular/router/testing)'],
	...coverageConfig,
};
