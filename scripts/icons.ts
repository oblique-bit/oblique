import {readFileSync, readdirSync, writeFileSync} from 'fs';
import path from 'path';

class Icons {
	static perform(): void {
		const SVGs = Icons.getSVGs(path.join('projects', 'oblique', 'icons'));
		Icons.writeIconSet(path.join('projects', 'oblique', 'src', 'assets', 'obliqueIcons.svg'), SVGs);
		Icons.writeIconSetTS(path.join('projects', 'oblique', 'src', 'assets', 'oblique-icons.ts'), SVGs);
		Icons.writeIconCSS(path.join('projects', 'oblique', 'src', 'styles', 'scss', 'oblique-icons.scss'), SVGs);
		Icons.writeIconEnum(path.join('projects', 'oblique', 'src', 'lib', 'icon', 'icon.model.ts'), SVGs);
	}

	private static getSVGs(iconsPath: string): string[] {
		return readdirSync(iconsPath)
			.sort((first, second) => first.toLowerCase().localeCompare(second.toLowerCase()))
			.map(fileName => Icons.readIconFile(fileName, iconsPath));
	}

	private static readIconFile(fileName: string, iconsPath: string): string {
		const id = fileName
			.replace(/(?<first>[a-z])(?<second>[A-Z])/g, '$<first>-$<second>')
			.toLowerCase()
			.replace('.svg', '');
		return readFileSync(path.join(iconsPath, fileName))
			.toString()
			.replace(/\n*/g, '')
			.replace(/#171717/g, 'currentColor')
			.replace('<svg ', `<svg id="${id}" `)
			.replace(/<title>.+?<\/title>/g, '');
	}

	private static writeIconSet(filePath: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '\t<defs>', ...SVGs.map(svg => `\t\t${svg}`), '\t</defs>', '</svg>'];
		writeFileSync(filePath, iconSet.join('\n'));
	}

	private static writeIconSetTS(filePath: string, SVGs: string[]): void {
		const iconSet = ['<svg>', '<defs>', ...SVGs, '</defs>', '</svg>'];
		writeFileSync(filePath, `export const iconSet =\n\t'${iconSet.join('')}';\n`);
	}

	private static writeIconCSS(filePath: string, SVGs: string[]): void {
		const iconCSS = [
			`.ob-icon::before {\n\tdisplay: inline-block;\n\twidth: 1em;\n\theight: 1em;\n}`,
			...SVGs.map(
				svg => `.ob-${/(?<=id=")[a-z-]*(?=")/.exec(svg)[0]}::before {\n\tcontent: url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}');\n}`
			)
		];
		writeFileSync(filePath, iconCSS.join('\n\n'));
	}

	private static writeIconEnum(filePath: string, SVGs: string[]): void {
		const iconNames = SVGs.map(svg => /(?<=id=")[a-z-]*(?=")/.exec(svg).toString()).map(name => `${name.toUpperCase().replace(/-/g, '_')} = '${name}'`);
		writeFileSync(
			filePath,
			readFileSync(filePath)
				.toString()
				.replace(/(?<=export enum ObEIcon {\r?\n).*(?=})/s, `${iconNames.map(name => `\t${name}`).join(',\n')}\n`)
		);
	}
}

Icons.perform();
