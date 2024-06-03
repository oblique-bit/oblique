import path from 'path';
import {CopyFiles} from '../../../../scripts/shared/copy-files';

export class CopyNginx {
	private static readonly source = path.join('src', 'nginx');
	private static readonly confDestination = path.join('nginx', 'conf', 'includes');

	static perform(): void {
		CopyFiles.initialize('sds')
			.copyFile('Staticfile', CopyNginx.source, 'nginx')
			.copyFile('custom_headers.conf', CopyNginx.source, CopyNginx.confDestination)
			.copyFile('security_headers.conf', CopyNginx.source, CopyNginx.confDestination)
			.finalize();
	}
}

CopyNginx.perform();
