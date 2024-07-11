import path from 'path';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';

class PostDist extends StaticScript {
	static perform(): void {
		Log.start('Finalize build');
		const source = path.join('src', 'nginx');
		const destination = path.join('nginx', 'conf', 'includes');
		CopyFiles.initialize('sds')
			.copyFile('Staticfile', source, '')
			.copyFile('custom_headers.conf', source, destination)
			.copyFile('security_headers.conf', source, destination)
			.finalize();
		Log.success();
	}
}

PostDist.perform();
