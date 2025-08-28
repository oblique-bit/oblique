import {executeCommandWithLog} from '../../../scripts/shared/utils';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

interface SVG {
	svg: string;
	id: string;
}

class Icons extends StaticScript {
	static perform(): void {
		Log.start('Update all files related to icons');
		const svgs = Icons.getSVGs('icons');
		Icons.writeIconSet('src/assets/obliqueIcons.svg', svgs);
		Icons.writeIconSetTS('src/assets/oblique-icons.ts', svgs);
		Icons.writeIconCSS('src/styles/scss/oblique-icons.scss', svgs);
		Icons.writeIconEnum('src/lib/icon/icon.model.ts', svgs);
		Icons.prettify();
		Log.success();
	}

	private static getSVGs(iconsPath: string): SVG[] {
		return Files.readDirectory(iconsPath)
			.sort((first, second) => first.toLowerCase().localeCompare(second.toLowerCase()))
			.map(fileName => ({fileName, id: Icons.getId(fileName)}))
			.map(({fileName, id}) => ({svg: Icons.readIconFile(fileName, iconsPath, id), id}));
	}

	private static getId(fileName: string): string {
		return fileName
			.replace(/(?<first>[a-z])(?<second>[A-Z])/g, '$<first>-$<second>')
			.toLowerCase()
			.replace('.svg', '');
	}

	private static readIconFile(fileName: string, iconsPath: string, id: string): string {
		// unnecessary parts are removed to reduce the library weight
		return Files.read(`${iconsPath}/${fileName}`)
			.replace(/\n*/g, '')
			.replace(/(?<=id=")a(?=")/, id) // id is mandatory for Material to identify icons
			.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
	}

	private static writeIconSet(filePath: string, svgs: SVG[]): void {
		Log.info('Generate icon set as SVG: obliqueIcons.svg');
		const iconSet = ['<svg>', '\t<defs>', ...svgs.map(({svg}) => `\t\t${svg}`), '\t</defs>', '</svg>'];
		Files.write(filePath, iconSet.join('\n'));
	}

	private static writeIconSetTS(filePath: string, svgs: SVG[]): void {
		Log.info('Generate icon set as TypeScript variable: oblique-icons.ts');
		const iconSet = ['<svg>', '<defs>', ...svgs.map(({svg}) => svg), '</defs>', '</svg>'];
		Files.write(filePath, `export const iconSet =\n\t'${iconSet.join('')}';\n`);
	}

	private static writeIconCSS(filePath: string, svgs: SVG[]): void {
		Log.info('Generate icon set as CSS classes: oblique-icons.scss');
		const iconCSS = [
			`.ob-icon {\n\t&::before {\n\tdisplay: inline-block;\n\twidth: 1em;\n\theight: 1em;\n}`,
			...svgs.map(
				({svg, id}) => `&.ob-${id}::before {\n\tcontent: url("data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}");\n}`
			),
			`\n}`
		];
		Files.write(filePath, `${iconCSS.join('\n\n')}\n`);
	}

	private static writeIconEnum(filePath: string, svgs: SVG[]): void {
		Log.info('Generate icon set as Enum: icon.model.ts');
		const iconNames = svgs.map(({id}) => `${id.toUpperCase().replace(/-/g, '_')} = '${id}'`);
		Files.write(
			filePath,
			Files.read(filePath).replace(/(?<=export enum ObEIcon {\r?\n).*(?=})/s, `${iconNames.map(name => `\t${name}`).join(',\n')}\n`)
		);
	}

	private static prettify(): void {
		const files = ['src/assets/oblique-icons.ts', 'src/styles/scss/oblique-icons.scss', 'src/lib/icon/icon.model.ts'].join(',');
		executeCommandWithLog(`prettier "{${files}}" --log-level warn --write`, 'Prettify generated files');
	}
}

Icons.perform();
