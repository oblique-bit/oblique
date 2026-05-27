import fs from 'fs';
import {Log} from '../../../scripts/shared/log';
import {checkRules} from './check-lint-rules';
import {getAbsolutePath} from '../../../scripts/shared/root';

const cliDistDir: string = getAbsolutePath('dist/toolchain');

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
Log.info('Checking linting rules');
checkRules();
Log.success();
