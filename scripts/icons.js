/* eslint-disable */

const fs = require('fs'),
	path = require('path');

const iconsPath = path.join('projects', 'oblique', 'icons');
const iconSetPath = path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg');

fs.writeFileSync(iconSetPath, '<svg>\n\t<defs>');
fs.readdirSync(iconsPath)
	.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
	.forEach(file => {
		const id = file.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('.svg', '');
		const icon = fs.readFileSync(path.join(iconsPath, file)).toString()
			.replace(/\n*/g, '')
			.replace(/#171717/g, 'currentColor')
			.replace('<svg ', `<svg id="${id}" `);
		fs.appendFileSync(iconSetPath, `\n\t\t${icon}`);
	});
fs.appendFileSync(iconSetPath, '\t</defs>\n</svg>');
