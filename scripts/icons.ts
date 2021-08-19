(function () {
	const fs = require('fs');
	const path = require('path');

	manageIcons();

	function manageIcons() {
		const SVGs = getSVGs(path.join('projects', 'oblique', 'icons'));
		writeIconSet(path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg'), SVGs);
		writeIconSetTS(path.join('projects', 'oblique', 'src', 'assets', 'oblique-icons.ts'), SVGs);
		writeIconCSS(path.join('projects', 'oblique', 'src', 'styles', 'scss', 'oblique-icons.scss'), SVGs);
		writeIconEnum(path.join('projects', 'oblique', 'src', 'lib', 'icon', 'icon.model.ts'), SVGs);
	}

	function getSVGs(iconsPath: string): string[] {
		return fs
			.readdirSync(iconsPath)
			.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
			.map(file => readIconFile(file, iconsPath));
	}

	function readIconFile(file, iconsPath): string {
		const id = file
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.toLowerCase()
			.replace('.svg', '');
		return fs
			.readFileSync(path.join(iconsPath, file))
			.toString()
			.replace(/\n*/g, '')
			.replace(/#171717/g, 'currentColor')
			.replace('<svg ', `<svg id="${id}" `)
			.replace(/<title>.+?<\/title>/g, '');
	}

	function writeIconSet(file: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '\t<defs>', ...SVGs.map(svg => `\t\t${svg}`), '\t</defs>', '</svg>'];
		fs.writeFileSync(file, iconSet.join('\n'));
	}

	function writeIconSetTS(file: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '<defs>', ...SVGs, '</defs>', '</svg>'];
		fs.writeFileSync(file, `export const iconSet = '${iconSet.join('')}';`);
	}

	function writeIconCSS(file: string, SVGs: string[]): void {
		const iconCSS = [
			`.ob-icon::before {\n\tdisplay: inline-block;\n\twidth: 1.5em;\n\theight: 1.5em;\n\tline-height: 1.5;\n}`,
			...SVGs.map(
				svg =>
					`.ob-${/(?<=id=")[a-z-]*(?=")/.exec(svg)}::before {\n\tcontent: url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}');\n}`
			)
		];
		fs.writeFileSync(file, iconCSS.join('\n\n'));
	}

	function writeIconEnum(file: string, SVGs: string[]): void {
		const iconNames = SVGs.map(svg => /(?<=id=")[a-z-]*(?=")/.exec(svg).toString()).map(name => `${name.toUpperCase().replace(/-/g, '_')} = '${name}'`);
		fs.writeFileSync(
			file,
			fs
				.readFileSync(file)
				.toString()
				.replace(/(?<=export enum ObEIcon {\n).*(?=})/s, `${iconNames.map(name => `\t${name}`).join(',\n')}\n`)
		);
	}
})();
