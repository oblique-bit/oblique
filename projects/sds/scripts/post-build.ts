import {CopyFiles} from '../../../scripts/shared/copy-files';
import {Log} from '../../../scripts/shared/log';
import {AddScriptloader} from '../../../scripts/shared/script-loader';

Log.start('Finalize build');
const source = 'src/nginx';
const destination = 'nginx/conf/includes';
const pathToIndexFile = '../../dist/sds/public/index.html';
const pathToSecurityHeadersFile = '../../dist/sds/nginx/conf/includes/security_headers.conf';

CopyFiles.initialize('sds')
	.copyFile('custom_headers.conf', source, destination)
	.copyFile('security_headers.conf', source, destination)
	.finalize();

AddScriptloader.initialize()
	.addScriptLoaders(pathToIndexFile)
	.addShaToSecurityHeaders(pathToIndexFile, pathToSecurityHeadersFile)
	.finalize();
Log.success();
