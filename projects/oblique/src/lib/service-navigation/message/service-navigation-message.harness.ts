import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {MatBadgeHarness} from '@angular/material/badge/testing';

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

	public getTooltipHarness(): Promise<MatTooltipHarness> {
		return this.getHarnessOrNull(MatTooltipHarness);
	}

	public getBadgeHarness(): Promise<MatBadgeHarness> {
		return this.getHarnessOrNull(MatBadgeHarness);
	}
}
