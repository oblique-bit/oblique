var fs = require('fs'),
	path = require('path');

fs.writeFile(
	path.join('projects', 'oblique', 'src', 'lib', 'version.ts'),
	'export const appVersion = \'' + process.argv[2] + '\';\n',
	{flag: 'w'},
	function (err) {
		console.log(err || 'Version patched');
	});
