'use strict';

module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/oblique'];
module.exports.displayName = {
	name: 'Oblique',
	color: 'cyan'
};
module.exports.reporters[1][1].publicPath = '<rootDir>/jest-report/oblique';
