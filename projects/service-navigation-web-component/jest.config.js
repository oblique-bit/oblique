// @ts-check
import baseConfig from '../../tests/jest.config.js';

export default {
	...baseConfig,
	roots: ['<rootDir>/projects/service-navigation-web-component'],
	displayName: {
		name: 'Service Navigation Web Component',
		color: 'cyan',
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts',
	},
	coverageDirectory: '<rootDir>/coverage/service-navigation',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
};
