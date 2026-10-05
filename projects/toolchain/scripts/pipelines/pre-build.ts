import fs from 'fs';
import {Log} from '../../../../scripts/shared/log';
import {checkRules} from '../actions/check-lint-rules';
import {getAbsolutePath} from '../../../../scripts/shared/root';
import {obCreateLogger} from '../../src/logger';

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
const logger = obCreateLogger().group('Checking linting rules');
checkRules(logger);
logger.end();
