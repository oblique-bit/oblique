globalThis.ngJest = {
	skipNgcc: true
};
const coverageConfig = require('./jest.config.coverage');
module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	transformIgnorePatterns: ['node_modules/?!(@angular/common/locales)'],
	...coverageConfig
};
