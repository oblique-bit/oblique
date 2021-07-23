/* eslint-disable */

const fs = require('fs');

if (fs.existsSync('package-lock.json')) {
	fs.writeFileSync(
		'package-lock.json',
		fs.readFileSync('package-lock.json').toString().replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
	);
}
