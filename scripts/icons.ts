class Icons {
	private static readonly fs = require('fs');
	private static readonly path = require('path');

	static perform() {
		const SVGs = Icons.getSVGs(Icons.path.join('projects', 'oblique', 'icons'));
		Icons.writeIconSet(Icons.path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg'), SVGs);
		Icons.writeIconSetTS(Icons.path.join('projects', 'oblique', 'src', 'assets', 'oblique-icons.ts'), SVGs);
		Icons.writeIconCSS(Icons.path.join('projects', 'oblique', 'src', 'styles', 'scss', 'oblique-icons.scss'), SVGs);
		Icons.writeIconEnum(Icons.path.join('projects', 'oblique', 'src', 'lib', 'icon', 'icon.model.ts'), SVGs);
	}

	private static getSVGs(iconsPath: string): string[] {
		return Icons.fs
			.readdirSync(iconsPath)
			.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
			.map(fileName => Icons.readIconFile(fileName, iconsPath));
	}

	private static readIconFile(fileName: string, iconsPath: string): string {
		const id = fileName
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.toLowerCase()
			.replace('.svg', '');
		return Icons.fs
			.readFileSync(Icons.path.join(iconsPath, fileName))
			.toString()
			.replace(/\n*/g, '')
			.replace(/#171717/g, 'currentColor')
			.replace('<svg ', `<svg id="${id}" `)
			.replace(/<title>.+?<\/title>/g, '');
	}

	private static writeIconSet(filePath: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '\t<defs>', ...SVGs.map(svg => `\t\t${svg}`), '\t</defs>', '</svg>'];
		Icons.fs.writeFileSync(filePath, iconSet.join('\n'));
	}

	private static writeIconSetTS(filePath: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '<defs>', ...SVGs, '</defs>', '</svg>'];
		Icons.fs.writeFileSync(filePath, `export const iconSet =\n\t'${iconSet.join('')}';\n`);
	}

	private static writeIconCSS(filePath: string, SVGs: string[]): void {
		const iconCSS = [
			`.ob-icon::before {\n\tdisplay: inline-block;\n\twidth: 1em;\n\theight: 1em;\n}`,
			...SVGs.map(
				svg =>
					`.ob-${/(?<=id=")[a-z-]*(?=")/.exec(svg)}::before {\n\tcontent: url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}');\n}`
			)
		];
		Icons.fs.writeFileSync(filePath, iconCSS.join('\n\n'));
	}

	private static writeIconEnum(filePath: string, SVGs: string[]): void {
		const iconNames = SVGs.map(svg => /(?<=id=")[a-z-]*(?=")/.exec(svg).toString()).map(name => `${name.toUpperCase().replace(/-/g, '_')} = '${name}'`);
		Icons.fs.writeFileSync(
			filePath,
			Icons.fs
				.readFileSync(filePath)
				.toString()
				.replace(/(?<=export enum ObEIcon {\r?\n).*(?=})/s, `${iconNames.map(name => `\t${name}`).join(',\n')}\n`)
		);
	}
}

Icons.perform();
