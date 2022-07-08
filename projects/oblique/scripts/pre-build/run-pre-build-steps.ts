import {CopyErrorMessages} from './steps/copy-error-messages';
import {Icons} from './steps/icons';
import {execSync} from 'child_process';

CopyErrorMessages.perform();
Icons.perform();

const files = [
	'projects/oblique/src/assets/oblique-icons.ts',
	'projects/oblique/src/styles/scss/oblique-icons.scss',
	'projects/oblique/src/lib/icon/icon.model.ts',
	'projects/oblique/src/lib/error-messages/error-messages.description.html'
].join(',');
execSync(`prettier "{${files}}" --loglevel warn --write`, {stdio: 'inherit'});
