import path from 'path';
import {Log} from '../../../scripts/shared/log';
import fs from 'fs';

const workingDir: string = process.cwd();
const obTourDistDir: string = path.resolve(workingDir, '../../dist/ob-tour');
Log.start('Initialize build');
try {
	Log.info('Delete dist/ob-tour folder');
	fs.rmSync(obTourDistDir, {recursive: true, force: true});
} catch (err) {
	if (err instanceof Error) {
		Log.error(err.message);
	} else if (typeof err === 'string') {
		Log.error(err);
	}
}
