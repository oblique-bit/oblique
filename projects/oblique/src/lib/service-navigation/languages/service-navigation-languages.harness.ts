import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';

export class ObServiceNavigationLanguagesHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-languages';

	public async getLanguageButtons(): Promise<TestElement[]> {
		return this.locatorForAll('button')();
	}
}
