import {executeCommandWithLog} from './shared/utils';
import {Log} from './shared/log';
import {Git} from './shared/git';

class DeleteTags {
	static perform(): void {
		Log.start('Delete sds and sandbox tags created by RHOS');
		const sandboxTags = Git.getTagsByPattern('sandbox*').replace(/\n/gmu, ' ');
		const sdsTags = Git.getTagsByPattern('sds*').replace(/\n/gmu, ' ');
		executeCommandWithLog(`git tag -d ${sdsTags}`, 'Remove tags for sds');
		executeCommandWithLog(`git tag -d ${sandboxTags}`, 'Remove tags for sandbox');
		Log.success();
	}
}

DeleteTags.perform();
