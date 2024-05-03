'use strict';

module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/service-navigation-web-component'];
module.exports.moduleNameMapper = {
	'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
	'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
};
module.exports.displayName = {
	name: 'Service Navigation Web Component',
	color: 'magenta'
};
module.exports.coveragePathIgnorePatterns = [
	'<rootDir>/node_modules/',
	'<rootDir>/projects/oblique',
	'<rootDir>/projects/stylesBuilder',
	'<rootDir>/tests/'
];
