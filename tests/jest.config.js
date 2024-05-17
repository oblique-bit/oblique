'use strict';
globalThis.ngJest = {
	skipNgcc: true
};
module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	collectCoverage: true
};
