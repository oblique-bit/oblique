import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';
import {Log} from '../../../scripts/shared/log';

Log.start('Lint CLI project');
Lint.initialize(hasFlag('fix')).esLint('**/*.{ts,js}', '.eslintrc.local.yml').prettier('**/*.{ts,js,json,yml,md}').finalize();
Log.success();
