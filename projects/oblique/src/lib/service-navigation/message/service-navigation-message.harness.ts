import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatIconHarness} from '@angular/material/icon/testing';

export class ObServiceNavigationMessageHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-message';

	public async getLink(): Promise<TestElement> {
		return this.locatorFor('a')();
	}

	public async getLinkScreenReaderText(): Promise<string> {
		const element = await this.locatorFor('a .ob-screen-reader-only')();
		return element.text();
	}

	public async getIconHarness(): Promise<MatIconHarness> {
		return this.getHarnessOrNull(MatIconHarness);
	}
}
