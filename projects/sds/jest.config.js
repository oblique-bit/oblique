'use strict';

module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/sds'];
module.exports.moduleNameMapper = {
	'^content(.*)$': '<rootDir>/src/app/content$1',
	'^cms(.*)$': '<rootDir>/src/app/cms$1',
	'^component-pages(.*)$': '<rootDir>/src/app/component-pages$1',
	'^documentation-pages(.*)$': '<rootDir>/src/app/documentation-pages$1',
	'^!!raw-loader!.*': 'jest-raw-loader',
	'^shared(.*)$': '<rootDir>/src/app/shared$1',
	'^side-navigation(.*)$': '<rootDir>/src/app/side-navigation$1',
	'^test-helpers(.*)$': '<rootDir>/src/test-helpers$1',
	'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts'
};
module.exports.reporters[1][1].publicPath = '<rootDir>/jest-report/sds';
module.exports.displayName = {
	name: 'SDS',
	color: 'gray'
};
