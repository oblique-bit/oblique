// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sds'],
	displayName: {
		name: 'SDS',
		color: 'gray'
	},
	moduleNameMapper: {
		'^content(.*)$': '<rootDir>/src/app/content$1',
		'^cms(.*)$': '<rootDir>/src/app/cms$1',
		'^!!raw-loader!.*': 'jest-raw-loader',
		'^shared(.*)$': '<rootDir>/src/app/shared$1',
		'^side-navigation(.*)$': '<rootDir>/src/app/side-navigation$1',
		'^test-helpers(.*)$': '<rootDir>/src/test-helpers$1',
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts'
	},
	testPathIgnorePatterns: [
		'<rootDir>/projects/sds/schematics/src/add-code-example/templates',
		'<rootDir>/projects/sds/schematics/src/add-preview/templates'
	],
	coverageDirectory: '<rootDir>/coverage/sds',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique']
};
