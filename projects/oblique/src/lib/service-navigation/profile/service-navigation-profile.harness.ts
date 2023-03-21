import {ContentContainerComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatLegacyTooltipHarness as MatTooltipHarness} from '@angular/material/legacy-tooltip/testing';
import {ObServiceNavigationPopOverHarness} from '../shared/popover-section/service-navigation-popover.harness';

export class ObServiceNavigationProfileHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-profile';

	public getTriggerButton(): Promise<TestElement> {
		return this.locatorFor('button')();
	}

	public async getTriggerButtonScreenReaderText(): Promise<string> {
		const button = await this.locatorFor('button .ob-screen-reader-only')();
		return button.text();
	}

	public getTooltipHarness(): Promise<MatTooltipHarness> {
		return this.getHarnessOrNull(MatTooltipHarness);
	}

	public async openPopover(): Promise<void> {
		const button = await this.getTriggerButton();
		return button.click();
	}

	public async getPopoverHarness(): Promise<ObServiceNavigationPopOverHarness> {
		return this.getHarnessOrNull(ObServiceNavigationPopOverHarness);
	}
}
