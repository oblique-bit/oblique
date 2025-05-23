// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox'],
	displayName: {
		name: 'Sandbox',
		color: 'magenta'
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
	},
	coverageDirectory: '<rootDir>/coverage/sandbox',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique']
};
