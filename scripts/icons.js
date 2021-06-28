/* eslint-disable */

const fs = require('fs'),
	path = require('path');

const iconsPath = path.join('projects', 'oblique', 'icons');
const iconSetPath = path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg');
const SVGs = getSVGs();
const iconSet = ['<svg>', '\t<defs>', ...SVGs.map(svg => `\t\t${svg}`), '\t</defs>', '</svg>'];

fs.writeFileSync(iconSetPath, iconSet.join('\n'));


function getSVGs() {
	return fs.readdirSync(iconsPath)
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.map(file => readFile(file));
}

function readFile(file) {
	const id = file.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('.svg', '');
	return fs.readFileSync(path.join(iconsPath, file)).toString().replace(/\n*/g, '')
		.replace(/#171717/g, 'currentColor')
		.replace('<svg ', `<svg id="${id}" `)
		.replace(/<title>.+?<\/title>/g, '');
}
