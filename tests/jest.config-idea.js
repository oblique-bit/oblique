'use strict';

// NOTE: this enables local testing with IntelliJ
module.exports = require('../../tests/jest.config.js');
module.exports.rootDir =  '/home/dev/development/projects/oblique2-reactive/';
module.exports.setupFilesAfterEnv = ['/home/dev/development/projects/oblique2-reactive/tests/setupJest.ts'];
module.exports.moduleNameMapper = {
	'oblique': '/home/dev/development/projects/oblique2-reactive/projects/oblique/src/public_api.ts'
};
