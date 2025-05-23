import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

class PreBuild extends StaticScript {
	static perform(): void {
		Log.start('Generate oblique-components.scss');
		const componentPath = '../stylesBuilder/oblique-components.scss';
		const directoryPath = '../oblique/src/lib';
		const comment = '// This file is generated by the pre-build script, please do not edit';
		const styleUrls = PreBuild.generateComponentFile(directoryPath);
		Files.write(componentPath, `${comment}\n\n${styleUrls}`);
		Log.success();
	}

	private static generateComponentFile(directoryPath: string): string {
		return Files.list(directoryPath)
			.filter(filePath => filePath.endsWith('.component.ts'))
			.map(filePath => ({
				filePath: PreBuild.getDirectoryPath(filePath),
				content: Files.read(filePath)
			}))
			.map(file => ({filePath: file.filePath, styleUrls: /styleUrls:\s*\[(?<styleUrls>[^\]]*)]/m.exec(file.content)?.groups?.styleUrls}))
			.filter(file => file.styleUrls)
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.replace(/'|\t|\n|\.\/|\s/g, '')}))
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.split(',')}))
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.filter(url => !url.startsWith('.'))}))
			.map(file => file.styleUrls.map(fileName => `${file.filePath}/${fileName}`))
			.reduce<string[]>((flatArray, current) => [...flatArray, ...current], [])
			.map(styleUrl => `@use "${styleUrl}";`)
			.concat('')
			.join('\n');
	}

	private static getDirectoryPath(filePath: string): string {
		const pathChunks = filePath.split(Files.separator);
		pathChunks.pop();
		pathChunks[0] = 'projects';
		return pathChunks.join('/');
	}
}

PreBuild.perform();
