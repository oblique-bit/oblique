// @ts-check
import baseConfig from '../../tests/jest.config.js';

export default {
	...baseConfig,
	roots: ['<rootDir>/projects/oblique'],
	displayName: {
		name: 'Oblique',
		color: 'cyan',
	},
	moduleNameMapper: {
		'^@oblique/oblique$': '<rootDir>/projects/oblique/src/public_api.ts',
		'^@oblique/oblique/schema-validation$': '<rootDir>/projects/oblique/src/lib/schema-validation/public_api.ts',
	},
	coverageDirectory: '<rootDir>/coverage/oblique',
	collectCoverageFrom: [
		'<rootDir>/projects/oblique/src/lib/**/*.ts',
		'!**/_mocks/**',
		'!**/*.module.ts',
		'!**/**.harness.ts',
		'!**/index.ts',
		'!**/public_api.ts',
		// the following files have no spec files and therefore have a 0 coverage. Tests will be written later
		'!**/off-canvas-container.directive.ts',
	],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/oblique/src/lib/master-layout/master-layout/master-layout.component.ts': {
			branches: 90,
		},
	},
};
