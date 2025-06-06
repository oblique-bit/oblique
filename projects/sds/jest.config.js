// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sds'],
	displayName: {
		name: 'SDS',
		color: 'cyan'
	},
	moduleNameMapper: {
		'^content(.*)$': '<rootDir>/src/app/content$1',
		'^cms(.*)$': '<rootDir>/src/app/cms$1',
		'^!!raw-loader!.*': 'jest-raw-loader',
		'^shared(.*)$': '<rootDir>/src/app/shared$1',
		'^side-navigation(.*)$': '<rootDir>/src/app/side-navigation$1',
		'^test-helpers(.*)$': '<rootDir>/src/test-helpers$1',
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts'
	},
	testPathIgnorePatterns: [
		'<rootDir>/projects/sds/schematics/src/add-code-example/templates',
		'<rootDir>/projects/sds/schematics/src/add-preview/templates'
	],
	coverageDirectory: '<rootDir>/coverage/sds',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/sds/src/app.routes.ts': {
			statements: 30,
			branches: 0,
			functions: 0,
			lines: 30
		},
		'projects/sds/src/app/': {
			statements: 87,
			branches: 30,
			functions: 53,
			lines: 86
		},
		'projects/sds/src/app/cms/cms-data.service.ts': {
			statements: 69,
			branches: 100,
			functions: 50,
			lines: 66
		},
		'projects/sds/src/app/code-examples/code-examples.mapper.ts': {
			statements: 98,
			branches: 100,
			functions: 0,
			lines: 98
		},
		'projects/sds/src/app/code-examples/code-examples.model.ts': {
			statements: 80,
			branches: 73,
			functions: 100,
			lines: 80
		},
		'projects/sds/src/app/code-examples/code-examples/autocomplete/previews': {
			statements: 81,
			branches: 100,
			functions: 50,
			lines: 78
		},
		'projects/sds/src/app/code-examples/code-examples/chips/previews/autocomplete': {
			statements: 58,
			branches: 16,
			functions: 28,
			lines: 59
		},
		'projects/sds/src/app/code-examples/code-examples/dialog/previews/default': {
			statements: 90,
			branches: 100,
			functions: 50,
			lines: 88
		},
		'projects/sds/src/app/code-examples/code-examples/dialog/previews/spinner': {
			statements: 72,
			branches: 100,
			functions: 16,
			lines: 70
		},
		'projects/sds/src/app/code-examples/code-examples/file-upload/': {
			statements: 34,
			branches: 0,
			functions: 7.5,
			lines: 33
		},
		'projects/sds/src/app/code-examples/code-examples/focus-with-outline/previews/default': {
			statements: 78,
			branches: 100,
			functions: 33,
			lines: 81
		},
		'projects/sds/src/app/code-examples/code-examples/form/previews/input-prefixes-and-suffixes': {
			statements: 86,
			branches: 100,
			functions: 66,
			lines: 84
		},
		'projects/sds/src/app/code-examples/code-examples/form/previews/other-options': {
			statements: 90,
			branches: 83,
			functions: 66,
			lines: 88
		},
		'projects/sds/src/app/code-examples/code-examples/global-events/previews/ob-outside-filter': {
			statements: 87,
			branches: 100,
			functions: 60,
			lines: 86
		},
		'projects/sds/src/app/code-examples/code-examples/global-events/previews/properties': {
			statements: 76,
			branches: 100,
			functions: 55,
			lines: 75
		},
		'projects/sds/src/app/code-examples/code-examples/icons/previews/icons-gallery': {
			statements: 76,
			branches: 0,
			functions: 25,
			lines: 78
		},
		'projects/sds/src/app/code-examples/code-examples/nested-form/previews/reactive': {
			statements: 75,
			branches: 0,
			functions: 33,
			lines: 73
		},
		'projects/sds/src/app/code-examples/code-examples/nested-form/previews/template-driven': {
			statements: 75,
			branches: 0,
			functions: 33,
			lines: 73
		},
		'projects/sds/src/app/code-examples/code-examples/notification/previews/default': {
			statements: 88,
			branches: 100,
			functions: 50,
			lines: 85
		},
		'projects/sds/src/app/code-examples/code-examples/notification/previews/other-options': {
			statements: 52,
			branches: 0,
			functions: 8,
			lines: 47
		},
		'projects/sds/src/app/code-examples/code-examples/slide-toggle/previews/second': {
			statements: 87,
			branches: 0,
			functions: 50,
			lines: 83
		},
		'projects/sds/src/app/code-examples/code-examples/spinner/previews/custom-channel': {
			statements: 78,
			branches: 0,
			functions: 66,
			lines: 75
		},
		'projects/sds/src/app/code-examples/code-examples/spinner/previews/multiple-activations': {
			statements: 76,
			branches: 100,
			functions: 60,
			lines: 73
		},
		'projects/sds/src/app/code-examples/code-examples/tooltip/tooltip-code-examples.component.ts': {
			statements: 83,
			branches: 100,
			functions: 0,
			lines: 80
		},
		'projects/sds/src/app/component-page/component-pages/newsletter': {
			statements: 79,
			branches: 100,
			functions: 42,
			lines: 76
		},
		'projects/sds/src/app/feedback': {
			statements: 80,
			branches: 37,
			functions: 64,
			lines: 64
		},
		'projects/sds/src/app/feedback/feedback-form': {
			statements: 77,
			branches: 37,
			functions: 61,
			lines: 76
		},
		'projects/sds/src/app/shared/http-api-interceptor': {
			statements: 90,
			branches: 100,
			functions: 75,
			lines: 89
		},
		'projects/sds/src/app/shared/slug': {
			statements: 90,
			branches: 89,
			functions: 100,
			lines: 89
		},
		'projects/sds/src/app/shared/tabs': {
			statements: 73,
			branches: 0,
			functions: 40,
			lines: 81
		},
		'projects/sds/src/app/side-navigation': {
			statements: 56,
			branches: 3,
			functions: 26,
			lines: 58
		},
		'projects/sds/src/app/side-navigation/accordion-links': {
			statements: 79,
			branches: 33,
			functions: 75,
			lines: 77
		},
		'projects/sds/src/app/side-navigation/utils': {
			statements: 25,
			branches: 100,
			functions: 0,
			lines: 27
		},
		'projects/sds/src/app/side-navigation/version': {
			statements: 66,
			branches: 22,
			functions: 20,
			lines: 67
		},
		'projects/sds/src/app/tabbed-page': {
			statements: 49,
			branches: 0,
			functions: 11,
			lines: 50
		},
		'projects/sds/src/app/text-page': {
			statements: 61,
			branches: 0,
			functions: 38,
			lines: 60
		}
	}
};
