import {Files} from '../../../scripts/shared/files';
import {findObliqueRootPath} from '../../../scripts/shared/root';

const rootPath = findObliqueRootPath();
const projectName = 'design-system';
const projectRootPath = `${rootPath}/projects/${projectName}`;

const obliqueIconsFile = `${projectRootPath}/src/icons/obliqueIcons.svg`;
const iconComponentsFolder = `${projectRootPath}/src/lib/icons`;

const obliqueIcons = Files.read(obliqueIconsFile);

const getIconName = (id: string): string => {
	return id.replace(/[-_](?<char>[a-z])/gu, (sub, char: string) => char.toUpperCase());
};

const getIconFileContent = (name: string, path: string): string => {
	return `import type {ObRegistrableIcon} from '../icon/ob-icon-model';

export const ${name}Icon: ObRegistrableIcon = {
	key: '${name}',
	svg: '${path}',
};
`;
};

const getIndexFileContent = (iconsNames: string[]): string => {
	return iconsNames
		.map(iconName => {
			return `export * from "./${iconName}";`;
		})
		.join('\n');
};

const iconsNames = obliqueIcons
	.split('\n')
	.map(line => line.trim())
	.filter(line => line.startsWith('<svg '))
	.map(line => {
		const match = /<svg\b[^>]*\bid="(?<id>[^"]+)"[^>]*>.*?(?<path><path\b[^>]*\/?>)/su.exec(line);

		const id = match?.groups?.id;
		const path = match?.groups?.path;

		return {id, path};
	})
	.map(({id, path}) => {
		const iconName = getIconName(id || '');
		Files.write(`${iconComponentsFolder}/${iconName}.ts`, getIconFileContent(iconName, path || ''));
		return iconName;
	});

Files.write(`${iconComponentsFolder}/index.ts`, getIndexFileContent(iconsNames));
