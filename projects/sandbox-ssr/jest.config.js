// @ts-check
import baseConfig from '../../tests/jest.config.js';

export default {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox-ssr'],
	displayName: {
		name: 'Sandbox-SSR',
		color: 'cyan',
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/design-system': '<rootDir>/dist/design-system/index.js',
	},
	coverageDirectory: '<rootDir>/coverage/sandbox-ssr',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	collectCoverageFrom: [
		'<rootDir>/projects/sandbox-ssr/src/app/**/*.ts',
		'!**/multi-translate-loader*',
		'!**/app.config.server.ts',
		'!**/app.config.ts',
		'!**/*.routes.ts',
	],
};
