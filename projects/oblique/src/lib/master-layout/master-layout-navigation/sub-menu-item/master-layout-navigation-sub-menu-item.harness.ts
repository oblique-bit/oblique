import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';

export class ObMasterLayoutNavigationSubMenuItemHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-master-layout-navigation-sub-menu-item';

	public async getChildLink(): Promise<TestElement> {
		return this.locatorFor('.ob-master-layout-navigation-link')();
	}

	public async getDescendants(): Promise<TestElement> {
		return this.locatorFor('.descendants')();
	}
}
