import {CopyFiles} from '../../../scripts/shared/copy-files';
import {Log} from '../../../scripts/shared/log';

Log.start('Finalize build');
const source = 'src/nginx';
const destination = 'nginx/conf/includes';
CopyFiles.initialize('sds')
	.copyFile('Staticfile', source, '')
	.copyFile('custom_headers.conf', source, destination)
	.copyFile('security_headers.conf', source, destination)
	.finalize();
Log.success();
