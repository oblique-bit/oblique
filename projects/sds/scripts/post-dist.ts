import path from 'path';
import {CopyFiles} from '../../../scripts/shared/copy-files';

class PostDist {
	static perform(): void {
		const source = path.join('src', 'nginx');
		const destination = path.join('nginx', 'conf', 'includes');
		CopyFiles.initialize('sds')
			.copyFile('Staticfile', source, 'nginx')
			.copyFile('custom_headers.conf', source, destination)
			.copyFile('security_headers.conf', source, destination)
			.finalize();
	}
}

PostDist.perform();
