// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/oblique'],
	displayName: {
		name: 'Oblique',
		color: 'cyan',
	},
	coverageDirectory: '<rootDir>/coverage/oblique',
	collectCoverageFrom: [
		'<rootDir>/projects/oblique/src/lib/**/*.ts',
		'!**/_mocks/**',
		'!**/*.module.ts',
		'!**/**.harness.ts',
		'!**/index.ts',
		// the following files have no spec files and therefore have a 0 coverage. Tests will be written later
		'!**/off-canvas-container.directive.ts',
	],
};
