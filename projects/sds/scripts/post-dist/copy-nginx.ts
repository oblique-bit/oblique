import {copyFileSync, mkdirSync} from 'fs';
import path from 'path';

export class CopyNginx {
	private static readonly source = path.join('src', 'nginx');
	private static readonly rootDestination = path.join('..', '..', 'dist', 'sds');
	private static readonly confDestination = path.join(CopyNginx.rootDestination, 'nginx', 'conf', 'includes');

	static perform(): void {
		CopyNginx.copyFile('Staticfile', CopyNginx.source, CopyNginx.rootDestination);
		CopyNginx.copyFile('custom_headers.conf', CopyNginx.source, CopyNginx.confDestination);
		CopyNginx.copyFile('security_headers.conf', CopyNginx.source, CopyNginx.confDestination);
	}

	private static copyFile(filename: string, source: string, destination: string): void {
		mkdirSync(destination, {recursive: true});
		copyFileSync(path.join(source, filename), path.join(destination, filename));
	}
}

CopyNginx.perform();
