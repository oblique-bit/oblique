import fs from 'fs';
import {Log} from '../../../scripts/shared/log';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Files} from '../../../scripts/shared/files';
import {getAbsolutePath} from '../../../scripts/shared/root';

const cliDistDir: string = getAbsolutePath('dist/cli');

Log.start('Initialize build');
try {
	Log.info('Deleting dist/cli folder');
	fs.rmSync(cliDistDir, {recursive: true, force: true});
} catch (err) {
	Log.error((err as Error).message);
}
addVersionNumber();
addSchemaData();
Log.success();

function addVersionNumber(): void {
	Log.info('Add Oblique version to "cli-utils.ts"');
	const version = PackageJson.readVersion();
	Files.overwrite(getAbsolutePath('projects/cli/src/utils/cli-utils.ts'), content =>
		content.replace(/(?<=const version = ')\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+)?/u, version)
	);
}

function addSchemaData(): void {
	Log.info('Add schema data to "ob-new.model.ts"');
	const schema = Files.readJson(getAbsolutePath('projects/cli/src/new/schema.json')) as {properties: object};
	Files.overwrite(getAbsolutePath('projects/cli/src/new/ob-new.model.ts'), content =>
		content.replace(
			/(?<=const schema = ).*(?= as \{properties: ObNewOptions<ObSchemaOption>\})/u,
			JSON.stringify(schema)
		)
	);
}
