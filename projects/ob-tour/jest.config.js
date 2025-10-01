// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/ob-tour'],
	displayName: {
		name: 'Ob-Tour',
		color: 'cyan'
	},
	coverageDirectory: '<rootDir>/coverage/ob-tour',
	collectCoverageFrom: [
		'<rootDir>/projects/ob-tour/src/lib/**/*.ts',
		'!**/_mock/**',
		'!**/.*mock.*',
		'!**/*.module.ts',
		'!**/**.harness.ts',
		'!**/index.ts'
	]
};
