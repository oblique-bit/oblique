import {CopyErrorMessages} from './steps/copy-error-messages';
import {execSync} from 'child_process';

CopyErrorMessages.perform();

const files = ['projects/oblique/src/lib/error-messages/error-messages.description.html'].join(',');
execSync(`prettier "{${files}}" --loglevel warn --write`, {stdio: 'inherit'});
