// @ts-check
import baseConfig from '../../tests/jest.config.js';

export default {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox'],
	displayName: {
		name: 'Sandbox',
		color: 'cyan',
	},
	moduleNameMapper: {
		'@oblique/oblique/schema-validation': '<rootDir>/projects/oblique/src/lib/schema-validation/public_api.ts',
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts',
	},
	coverageDirectory: '<rootDir>/coverage/sandbox',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
};
