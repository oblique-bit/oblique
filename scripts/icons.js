/* eslint-disable */

const fs = require('fs'),
	path = require('path');

const iconsPath = path.join('projects', 'oblique', 'icons');
const iconSetPath = path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg');
const iconCSSPath = path.join('projects', 'oblique', 'src', 'styles', 'scss', 'oblique-icons.scss');
const SVGs = getSVGs(iconsPath);
writeIconSet(iconSetPath, SVGs);
writeIconCSS(iconCSSPath, SVGs);


function writeIconSet(file, SVGs) {
	const iconSet = ['<svg>', '\t<defs>', ...SVGs.map(svg => `\t\t${svg}`), '\t</defs>', '</svg>'];
	fs.writeFileSync(iconSetPath, iconSet.join('\n'));
}

function writeIconCSS(file, SVGs) {
	const iconCSS = [
		`.ob-icon::before {\n\tdisplay: inline-block;\n\twidth: 1.5em;\n\theight: 1.5em;\n\tline-height: 1.5;\n}`,
		...SVGs.map(svg => `.ob-${/(?<=id=")[a-z-]*(?=")/.exec(svg)}::before {\n\tcontent: url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}');\n}`)
	]
	fs.writeFileSync(iconCSSPath, iconCSS.join('\n\n'));
}

function getSVGs(iconsPath) {
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
