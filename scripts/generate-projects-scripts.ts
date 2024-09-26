import {Files} from './shared/files';
import {Log} from './shared/log';

const projectsPath = Files.buildOSSafePath(__dirname, '/../projects/');
const filePath = Files.buildOSSafePath(__dirname, '/../projects/package.json');

const getProjectPackagePath = (projectName: string): string =>
	Files.buildOSSafePath(__dirname, '/../projects/', projectName, 'package.json');

const config: Record<string, string[]> = {};

Files.readDirectory(projectsPath).forEach(projectName => {
	const projectPackagePath = getProjectPackagePath(projectName);
	if (Files.exists(projectPackagePath)) {
		const projectPackageInfo: {scripts: Record<string, string>} = Files.readJson(projectPackagePath);
		if (projectPackageInfo.scripts) {
			const startScripts = Object.keys(projectPackageInfo.scripts).filter(scriptName => scriptName.startsWith('start'));
			config[projectName] = startScripts;
		}
	}
});

Log.start(`Generating ${filePath}`);
const scripts = Object.entries(config).reduce(
	(acc, [key, val]) => ({
		...acc,
		...val.reduce(
			(coll, script) => ({
				...coll,
				[`${script}:${key}`]: `npm run ${script} --prefix ./${key}`
			}),
			{}
		)
	}),
	{}
);

scripts['generate-scripts'] = 'ts-node ../scripts/generate-projects-scripts';
Files.writeJson(filePath, {scripts});

Log.success();
