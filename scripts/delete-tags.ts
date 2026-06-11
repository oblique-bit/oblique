import {executeCommandWithLog} from './shared/utils';
import {Log} from './shared/log';
import {Git} from './shared/git';

class DeleteTags {
	static perform(): void {
		Log.start('Delete invalid tags');
		const allTags = Git.listExistingTags().replace(/\n/gmu, ' ').concat(' ');
		const tagsToRemove = allTags.replace(/v?\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+(?:-\d+)?)?\s/giu, '');
		executeCommandWithLog(`git tag -d ${tagsToRemove}`, 'Remove invalid tags');
		Log.success();
	}
}

DeleteTags.perform();
