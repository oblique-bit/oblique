module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/service-navigation-web-component'];
module.exports.displayName = {
	name: 'Service Navigation Web Component',
	color: 'magenta'
};
module.exports.moduleNameMapper = {
	'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
	'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
};
module.exports.coverageDirectory = '<rootDir>/coverage/service-navigation';
module.exports.coveragePathIgnorePatterns = ['<rootDir>/projects/oblique'];
