/* eslint-disable */

const fs = require('fs');
const lines = fs.readFileSync('.git/COMMIT_EDITMSG').toString().split('\n');
try {
	checkLineLength(lines, 100);
	checkEmptyLine(lines);
	checkHeader(lines[0]);
} catch (err) {
	console.error(`\nInvalid commit message: ${err.message}.\n\nSee details in README.md.\n`);
	process.exit(1);
}


function checkLineLength(lines, length) {
	const error = lines
		.map((line, i) => line.length > length ? numeral(i + 1) : '')
		.filter(line => !!line)
		.join(', ')
		.replace(/,(?=[^,]*$)/, ' and');
	const plural = error.indexOf(' and ' ) > -1;
	if (error) {
		throw new Error(`${error} line${plural ? 's' : ''} exceeds ${length} characters`);
	}
}

function checkEmptyLine(lines) {
	if (lines.length > 1 && !/^$/.test(lines[1])) {
		throw new Error(`2nd line has to be empty`);
	}
}

function checkHeader(header) {
	const readme = fs.readFileSync('README.md', 'utf8');
	const types = extractList(readme, 'Type');
	const scopes = extractList(readme, 'Scope');
	const regex = new RegExp(`^(?:${types.join('|')})(?:\\((?:${scopes.join('|')})\\))?: [a-z]`);
	if (!regex.test(header)) {
		throw new Error(`1st line doesn't follow "type(scope): subject" format`);
	}
}

function numeral(i) {
	switch (i) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return  `${i}th`
	}
}

function extractList(readme, type) {
	const start = readme.indexOf(`# ${type}`);
	const chunk = readme.substring(readme.indexOf('*', start), readme.indexOf('#', start + 1));
	return chunk.match(/\*\*.*\*\*/g).map(res => res.replace(/\*\*/g, ''));
}
