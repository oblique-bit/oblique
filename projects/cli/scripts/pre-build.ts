import fs from 'fs';
import path from 'path';
import {Log} from '../../../scripts/shared/log';

const workingDir: string = process.cwd();
const cliDistDir: string = path.resolve(workingDir, '../../dist/cli');

Log.start('Deleting dist/cli folder');
try {
	fs.rmSync(cliDistDir, {recursive: true, force: true});
	Log.success();
} catch (err) {
	Log.error((err as Error).message);
}
