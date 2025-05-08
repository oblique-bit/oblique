import {CopyFiles} from '../../../scripts/shared/copy-files';
import {Log} from '../../../scripts/shared/log';
import {AddScriptloader} from '../../../scripts/shared/script-loader';

Log.start('Finalize build');
const source = 'src/nginx/includes';
const destination = 'nginx/conf/includes';
const pathToIndexFile = '../../dist/sandbox/index.html';
const pathToSecurityHeadersFile = '../../dist/sandbox/nginx/conf/includes/security_headers.conf';

CopyFiles.initialize('sandbox')
	.copyFile('custom_headers.conf', source, destination)
	.copyFile('security_headers.conf', source, destination)
	.finalize();

AddScriptloader.initialize()
	.addScriptLoaders(pathToIndexFile)
	.addShaToSecurityHeaders(pathToIndexFile, pathToSecurityHeadersFile)
	.finalize();

Log.success();
