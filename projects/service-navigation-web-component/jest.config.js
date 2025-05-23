// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/service-navigation-web-component'],
	displayName: {
		name: 'Service Navigation Web Component',
		color: 'magenta'
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
	},
	coverageDirectory: '<rootDir>/coverage/service-navigation',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique']
};
