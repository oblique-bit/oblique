import fs from 'fs';
import path from 'path';
import {Log} from '../../../scripts/shared/log';

const workingDir: string = process.cwd();
const cliDistDir: string = path.resolve(workingDir, '../../dist/toolchain');

Log.start('Initialize build');
try {
	Log.info('Deleting dist/toolchain folder');
	fs.rmSync(cliDistDir, {recursive: true, force: true});
} catch (err) {
	if (err instanceof Error) {
		Log.error(err.message);
	} else if (typeof err === 'string') {
		Log.error(err);
	}
}
Log.success();
