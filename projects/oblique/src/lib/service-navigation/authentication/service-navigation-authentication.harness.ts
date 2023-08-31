import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';

export class ObServiceNavigationAuthenticationHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-authentication';

	public async getLinkElement(): Promise<TestElement> {
		return this.locatorForOptional('a')();
	}

	public async getButtonElement(): Promise<TestElement> {
		return this.locatorForOptional('button')();
	}

	public async getText(): Promise<string> {
		return (await this.getLinkElement()).text();
	}

	public async getButtonText(): Promise<string> {
		return (await this.getButtonElement()).text();
	}

	public async getIconHarness(): Promise<MatIconHarness> {
		return this.getHarnessOrNull(MatIconHarness);
	}

	public getTooltipHarness(): Promise<MatTooltipHarness> {
		return this.getHarnessOrNull(MatTooltipHarness);
	}
}
