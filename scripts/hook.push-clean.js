/* eslint-disable */

const execSync = require('child_process').execSync

execSync('npm run format');

try {
	execSync('git add .');
	execSync('git commit -m "format: clean code"');
}
catch(e) {}
