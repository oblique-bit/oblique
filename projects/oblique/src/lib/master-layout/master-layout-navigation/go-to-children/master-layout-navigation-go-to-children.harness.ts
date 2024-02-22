import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';

export class ObMasterLayoutNavigationGoToChildrenHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-master-layout-navigation-go-to-children';

	public async getButton(): Promise<TestElement> {
		return this.locatorFor('.ob-master-layout-navigation-go-to-children-button')();
	}
}
