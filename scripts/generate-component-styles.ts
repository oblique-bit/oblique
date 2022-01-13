class GenerateComponentStyles {
	private static readonly fs = require('fs');
	private static readonly path = require('path');

	static perform(): void {
		const componentPath = GenerateComponentStyles.path.join('projects', 'stylesBuilder', 'oblique-components.scss');
		const directoryPath = GenerateComponentStyles.path.join('projects', 'oblique', 'src', 'lib');
		const comment = '// This file is generated by the postdist script, please do not edit';
		const styleUrls = GenerateComponentStyles.generateComponentFile(directoryPath);
		GenerateComponentStyles.fs.writeFileSync(componentPath, `${comment}\n\n${styleUrls}`);
	}

	private static generateComponentFile(directoryPath: string): string {
		return GenerateComponentStyles.listFiles(directoryPath)
			.map(filePath => ({
				filePath: filePath.substring(0, filePath.lastIndexOf(GenerateComponentStyles.path.sep)),
				content: GenerateComponentStyles.fs.readFileSync(filePath, 'utf8')
			}))
			.map(file => ({filePath: file.filePath, styleUrls: /styleUrls:\s*\[(?<styleUrls>[^\]]*)]/m.exec(file.content)?.groups?.styleUrls}))
			.filter(file => file.styleUrls)
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.replace(/'|\t|\n|\.\/|\s/g, '')}))
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.split(',')}))
			.map(file => ({filePath: file.filePath, styleUrls: file.styleUrls.filter(url => !url.startsWith('.'))}))
			.map(file => file.styleUrls.map(fileName => GenerateComponentStyles.path.join(file.filePath, fileName)))
			.reduce((flatArray, current) => [...flatArray, ...current], [])
			.map(styleUrl => `@import "${styleUrl}";`)
			.join('\n');
	}

	private static listFiles(directory: string): string[] {
		return GenerateComponentStyles.fs
			.readdirSync(directory)
			.map(fileName => GenerateComponentStyles.path.join(directory, fileName))
			.filter(fileName => fileName.indexOf('mock') === -1)
			.reduce(
				(filePaths, filePath) =>
					GenerateComponentStyles.fs.statSync(filePath).isDirectory() ? [...filePaths, ...GenerateComponentStyles.listFiles(filePath)] : [...filePaths, filePath],
				[]
			)
			.filter(filePath => filePath.endsWith('.component.ts'));
	}
}

GenerateComponentStyles.perform();