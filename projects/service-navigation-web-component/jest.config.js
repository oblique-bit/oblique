// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/service-navigation-web-component'],
	displayName: {
		name: 'Service Navigation Web Component',
		color: 'magenta'
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
	},
	coverageDirectory: '<rootDir>/coverage/service-navigation',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/service-navigation-web-component/src/app/service-navigation-web-component.component.ts': {
			statements: 95,
			branches: 73,
			functions: 83,
			lines: 95
		},
		'projects/service-navigation-web-component/src/app/translations-service.ts': {
			statements: 100,
			branches: 88,
			functions: 100,
			lines: 100
		}
	}
};
