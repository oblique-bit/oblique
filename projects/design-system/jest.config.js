// @ts-check
import baseConfig from '../../tests/jest.config.js';

export default {
	...baseConfig,
	roots: ['<rootDir>/projects/design-system'],
	displayName: {
		name: 'design-system',
		color: 'cyan',
	},
	coverageDirectory: '<rootDir>/coverage/design-system',
	collectCoverageFrom: ['<rootDir>/projects/design-system/src/lib/**/*.ts', '!**/**.harness.ts', '!**/index.ts'],
};
