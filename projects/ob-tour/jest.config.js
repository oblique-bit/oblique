// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/ob-tour'],
	displayName: {
		name: 'Ob-Tour',
		color: 'cyan'
	},
	moduleNameMapper: {
		'^@oblique/oblique$': '<rootDir>/projects/oblique/src/public_api.ts',
		'^@oblique/(.*)$': '<rootDir>/projects/oblique/src/lib/$1'
	},
	coverageDirectory: '<rootDir>/coverage/ob-tour',
	collectCoverageFrom: [
		'<rootDir>/projects/ob-tour/src/lib/**/*.ts',
		'!**/_mock/**',
		'!**/.*mock.*',
		'!**/*.module.ts',
		'!**/**.harness.ts',
		'!**/index.ts',
		'!**/tour-translation-factory.service.ts'
	],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/ob-tour/src/lib/services/tour-overlay.service.ts': {
			branches: 97.26
		},
		'projects/ob-tour/src/lib/services/tour-menu-visibility.service.ts': {
			branches: 90.47
		}
	}
};
