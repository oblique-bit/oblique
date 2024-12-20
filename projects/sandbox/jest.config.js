module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/sandbox'];
module.exports.displayName = {
	name: 'Sandbox',
	color: 'magenta'
};
module.exports.moduleNameMapper = {
	'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
	'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
};
module.exports.coverageDirectory = '<rootDir>/coverage/sandbox';
module.exports.coveragePathIgnorePatterns = ['<rootDir>/projects/oblique'];
