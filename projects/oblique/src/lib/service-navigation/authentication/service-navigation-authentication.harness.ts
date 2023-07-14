import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';

export class ObServiceNavigationAuthenticationHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-authentication';

	public async getLinkElement(): Promise<TestElement> {
		return this.locatorFor('a')();
	}

	public async getText(): Promise<string> {
		return (await this.getLinkElement()).text();
	}

	public async getIconHarness(): Promise<MatIconHarness> {
		return this.getHarnessOrNull(MatIconHarness);
	}

	public getTooltipHarness(): Promise<MatTooltipHarness> {
		return this.getHarnessOrNull(MatTooltipHarness);
	}
}
