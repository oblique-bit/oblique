import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';

export class ObServiceNavigationHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation';

	getListElement(): Promise<TestElement> {
		return this.locatorForOptional('ul')();
	}

	getListItemElements(): Promise<TestElement[]> {
		return this.locatorForAll('ul > li > *')();
	}

	getCustomWidgets(): Promise<TestElement[]> {
		return this.locatorForAll('ul > li.ob-service-navigation-custom-control > *')();
	}
}
