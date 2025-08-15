import {StaticScript} from './static-script';
import {Files} from './files';
import {createHash} from 'crypto';
import {Log} from './log';

interface Script {
	src: string;
	type?: string;
	defer?: boolean;
}

export class AddScriptloader extends StaticScript {
	private readonly pathToScriptLoader = '../../scripts/shared/scriptLoaderTemplate.txt';
	private readonly pathToOnLoadTemplate = '../../scripts/shared/onLoadTemplate.txt';

	static initialize(): AddScriptloader {
		StaticScript.instance = new AddScriptloader();
		return AddScriptloader.instance as AddScriptloader;
	}

	addScriptLoaders(pathToIndexFile: string): AddScriptloader {
		Log.info(`Replace scripts with a custom script loader in index.html`);
		const scriptSrcAttrRegex = /<script\ssrc="(?<src>\w+\.\w+\.js)"\s(?:type="(?<type>\w+)")?(?<defer>defer)?><\/script>/g;
		const foundScripts: Script[] = [];
		const fileContent = Files.read(pathToIndexFile);

		// eslint-disable-next-line @typescript-eslint/init-declarations
		let lastMatch: Record<string, string>;
		while ((lastMatch = scriptSrcAttrRegex.exec(fileContent)?.groups)) {
			const script: Script = {src: lastMatch.src};
			if (lastMatch.defer) {
				script.defer = true;
			}
			if (lastMatch.type) {
				script.type = lastMatch.type;
			}
			foundScripts.push(script);
		}

		Files.write(
			pathToIndexFile,
			fileContent
				.replace(/<script.*<\/script>/gm, Files.read(this.pathToScriptLoader))
				.replace(/SCRIPT_ARRAY/, JSON.stringify(foundScripts))
		);

		this.addOnLoadScriptLoader(pathToIndexFile);
		return AddScriptloader.instance as AddScriptloader;
	}

	addOnLoadScriptLoader(pathToIndexFile: string): AddScriptloader {
		const onLoadContentRegex = /onload="this\.media='all'"/;
		const fileContent = Files.read(pathToIndexFile);
		if (fileContent.includes('onload="this.media=\'all\'"')) {
			Files.write(
				pathToIndexFile,
				fileContent.replace(onLoadContentRegex, 'load-handler').replace(/<\/script>/gm, Files.read(this.pathToOnLoadTemplate))
			);
		}
		return AddScriptloader.instance as AddScriptloader;
	}

	addShaToSecurityHeaders(pathToIndexFile: string, pathToSecurityHeadersFile: string): AddScriptloader {
		Log.info(`Add sha256 of the scripts in index.html to the security_headers.conf`);
		const indexFileContent = Files.read(pathToIndexFile);
		const securityFileFileContent = Files.read(pathToSecurityHeadersFile);
		const scriptSrcTemplate = AddScriptloader.getScriptSrcTemplate(indexFileContent);

		Files.write(pathToSecurityHeadersFile, securityFileFileContent.replace(/script-src[^;]*/g, scriptSrcTemplate));

		return AddScriptloader.instance as AddScriptloader;
	}

	private static getScriptSrcTemplate(indexFileContent: string): string {
		const scriptHash = AddScriptloader.getScriptHash(indexFileContent);
		const onLoadScriptRegex = /(?<=<script>)\s*Array.*?(?=<\/script>)/s;
		if (onLoadScriptRegex.test(indexFileContent)) {
			const onLoadScriptContent = onLoadScriptRegex.exec(indexFileContent)[0];
			const onLoadHashValue = createHash('sha256').update(onLoadScriptContent).digest('base64');
			return `script-src 'sha256-${scriptHash}' 'sha256-${onLoadHashValue}' 'strict-dynamic';`;
		}
		return `script-src 'sha256-${scriptHash}' 'strict-dynamic';`;
	}

	private static getScriptHash(indexFileContent: string): string {
		const scriptContentRegex = /(?<=<script>).*?(?=<\/script>)/s;
		const scriptContent = scriptContentRegex.exec(indexFileContent)[0];
		return createHash('sha256').update(scriptContent).digest('base64');
	}
}
