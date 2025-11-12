// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/design-system'],
	displayName: {
		name: 'design-system',
		color: 'cyan',
	},
	coverageDirectory: '<rootDir>/coverage/design-system',
	collectCoverageFrom: ['<rootDir>/projects/design-system/src/lib/**/*.ts', '!**/**.harness.ts', '!**/index.ts'],
};
