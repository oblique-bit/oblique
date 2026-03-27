import {Files} from './shared/files';
import {Log} from './shared/log';
import {getAbsolutePath} from './shared/root';

const projectsPath = getAbsolutePath('projects');
const filePath = getAbsolutePath('projects/package.json');

const getProjectPackagePath = (projectName: string): string => getAbsolutePath(`projects/${projectName}/package.json`);

const config: Record<string, string[]> = {};

Files.readDirectory(projectsPath).forEach(projectName => {
	const projectPackagePath = getProjectPackagePath(projectName);
	if (Files.exists(projectPackagePath)) {
		const projectPackageInfo = Files.readJson(projectPackagePath) as {scripts: Record<string, string>};
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
				[`${script}:${key}`]: `npm run ${script} --prefix ./${key}`,
			}),
			{}
		),
	}),
	{}
);

scripts['generate-scripts'] = 'tsx ../scripts/generate-projects-scripts';
Files.writeJson(filePath, {scripts});

Log.success();
