import {ContentContainerComponentHarness} from '@angular/cdk/testing';
import {ObServiceNavigationPopOverSectionHarness} from './service-navigation-popover-section.harness';

export class ObServiceNavigationPopOverHarness extends ContentContainerComponentHarness {
	public static hostSelector = '.ob-popover-content';

	public getSections(): Promise<ObServiceNavigationPopOverSectionHarness[]> {
		return this.getAllHarnesses(ObServiceNavigationPopOverSectionHarness);
	}
}
