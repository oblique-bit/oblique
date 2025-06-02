// @ts-check
const coverageConfig = require('../../tests/jest.config.coverage');
module.exports = {
	displayName: {
		name: 'CLI',
		color: 'cyan'
	},
	/*
	 * As this is not an angular app, 'jest-preset-angular' is not used, meaning
	 * the 'transform' property has to be manually set
	 */
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	...coverageConfig,
	coverageDirectory: '../../coverage/cli',
	coverageThreshold: {
		...coverageConfig.coverageThreshold,
		'src/new/ob-new.ts': {
			statements: 96,
			branches: 100,
			functions: 100,
			lines: 96
		},
		'src/update/ob-update.ts': {
			statements: 87,
			branches: 83,
			functions: 100,
			lines: 87
		}
	}
};
