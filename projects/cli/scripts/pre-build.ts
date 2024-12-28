import fs from 'fs';
import path from 'path';
import {Log} from '../../../scripts/shared/log';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Files} from '../../../scripts/shared/files';

const workingDir: string = process.cwd();
const cliDistDir: string = path.resolve(workingDir, '../../dist/cli');

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
	Log.info('Add Oblique version to "ob-new.model.ts"');
	const version = PackageJson.readVersion();
	Files.overwrite('./src/new/ob-new.model.ts', content =>
		content.replace(/(?<=const version = ')\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?/, version)
	);
}

function addSchemaData(): void {
	Log.info('Add schema data to "ob-new.model.ts"');
	const schema = Files.readJson('src/new/schema.json') as {properties: object};
	Files.overwrite('./src/new/ob-new.model.ts', content =>
		content.replace(/(?<=const schema = ).*(?= as \{properties: ObNewOptions<ObNewSchemaOption>})/, JSON.stringify(schema))
	);
}
