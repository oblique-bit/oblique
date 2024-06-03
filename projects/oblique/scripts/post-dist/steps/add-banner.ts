import {Banner} from '../../../../../scripts/shared/banner';

export class AddBanner {
	static perform(): void {
		Banner.addToFilesInProject('oblique');
	}
}
