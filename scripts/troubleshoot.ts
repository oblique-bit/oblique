import {executeCommand} from './shared/utils';

class Troubleshoot {
	static perform(): void {
		Troubleshoot.createTroubleshootBranch();
	}

	private static createTroubleshootBranch(): void {
		executeCommand('git fetch --all');
		executeCommand('git checkout -b troubleshoot --no-track origin/master');
	}
}

Troubleshoot.perform();
