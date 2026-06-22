// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox'],
	displayName: {
		name: 'Sandbox',
		color: 'cyan',
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts',
	},
	coverageDirectory: '<rootDir>/coverage/sandbox',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/sandbox/src/app/samples/master-layout/dynamic-navigation.service.ts': {
			statements: 66,
			branches: 100,
			functions: 60,
			lines: 64,
		},
	},
};
