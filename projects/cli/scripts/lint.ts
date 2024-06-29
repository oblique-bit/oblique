import {hasFlag} from '../../../scripts/shared/utils';
import {Lint} from '../../../scripts/shared/lint';

Lint.initialize(hasFlag('fix')).esLint('**/*.{ts,js}', '.eslintrc.local.yml').prettier('**/*.{ts,js,json,yml,md}').finalize();
