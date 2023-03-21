import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatIconHarness} from '@angular/material/icon/testing';

export class ObServiceNavigationPopOverSectionHarness extends ContentContainerComponentHarness {
	public static hostSelector = 'ob-service-navigation-popover-section';

	public async getHeader(): Promise<TestElement> {
		return this.locatorForOptional('header')();
	}

	public async getLinkList(): Promise<TestElement> {
		return this.locatorForOptional('ul')();
	}

	public async getLinks(): Promise<TestElement[]> {
		return this.locatorForAll('ul > li > a')();
	}

	public async getIconHarnessesForNthLink(index: number): Promise<MatIconHarness> {
		const loader = await this.getChildLoader(`ul > li:nth-child(${index})`);
		return loader.getHarnessOrNull(MatIconHarness);
	}
}
