import {CopyFiles} from '../../../scripts/shared/copy-files';
import {Files} from '../../../scripts/shared/files';
import {Log} from '../../../scripts/shared/log';
import {createHash} from 'crypto';

interface Script {
	src: string;
	type?: string;
	defer?: boolean;
}

Log.start('Finalize build');
const source = 'src/nginx';
const destination = 'nginx/conf/includes';
const pathToIndexFile = '../../dist/sds/public/index.html';
const pathToSecurityHeadersFile = '../../dist/sds/nginx/conf/includes/security_headers.conf';

CopyFiles.initialize('sds')
	.copyFile('Staticfile', source, '')
	.copyFile('custom_headers.conf', source, destination)
	.copyFile('security_headers.conf', source, destination)
	.finalize();

// 1.) open index.html
// 2.) get the scripts' sources and other attributes at the bottom of the body (don't open the scripts, just store the value of their attributes)
const regex = /<script\ssrc="(?<src>\w+\.\w+\.js)"\s(?:type="(?<type>\w+)")?(?<defer>defer)?><\/script>/g;
const foundScripts: Script[] = [];
let lastMatch;
while ((lastMatch = regex.exec(Files.read(pathToIndexFile))?.groups)) {
	const script: Script = {src: lastMatch.src};
	if (lastMatch.defer) {
		script.defer = true;
	}
	if (lastMatch.type) {
		script.type = lastMatch.type;
	}
	foundScripts.push(script);
}

// 3.) remove all the scripts at the bottom of the body & add an uglified version of the following script loader at the bottom of the body
// 4.) replace the data in the array with the info read on point 2
Files.write(pathToIndexFile, Files.read(pathToIndexFile).replace(/<script.*<\/script>/gm, Files.read('scripts/scriptLoaderTemplate.html')));
Files.write(pathToIndexFile, Files.read(pathToIndexFile).replace(/SCRIPT_ARRAY/, JSON.stringify(foundScripts)));

// 5.) compute the sha256 hash of exactly what is in between <script> and </script>. Whitespace included, script tags excluded
const content = /(?:<script>)(?<content>[\s\S]*)(?:<\/script>)/g.exec(Files.read(pathToIndexFile))?.groups.content ?? '';
const hashValue = createHash('sha256').update(content).digest('hex');

// 6.) open security_headers.conf
// 7.) change script-src to exactly  `script-src 'sha256-<hash>' 'strict-dynamic'`
// 8.) replace <hash> with the hash computed on point 5
Files.write(
	pathToSecurityHeadersFile,
	Files.read(pathToSecurityHeadersFile).replace(/script-src[^;]*/g, "script-src 'sha256-<hash>' 'strict-dynamic'")
);
Files.write(pathToSecurityHeadersFile, Files.read(pathToSecurityHeadersFile).replace(/<hash>/g, hashValue));

Log.success();
