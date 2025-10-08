import {ComponentHarness} from '@angular/cdk/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';

export class ObtTourMenuHarness extends ComponentHarness {
	static hostSelector = 'obt-tour-menu';

	async getToggle(): Promise<MatSlideToggleHarness> {
		return this.locatorFor(MatSlideToggleHarness)();
	}

	async toggleOverviewVisibility(): Promise<void> {
		const toggle = await this.getToggle();
		await toggle.toggle();
	}

	async activateToggle(): Promise<void> {
		const toggle = await this.getToggle();
		const isChecked = await toggle.isChecked();
		if (!isChecked) {
			await toggle.toggle();
		}
	}

	async deactivateToggle(): Promise<void> {
		const toggle = await this.getToggle();
		const isChecked = await toggle.isChecked();
		if (isChecked) {
			await toggle.toggle();
		}
	}

	async isToggleChecked(): Promise<boolean> {
		const toggle = await this.getToggle();
		return toggle.isChecked();
	}

	getMenuButton(): Promise<MatButtonHarness> {
		return this.locatorForOptional(MatButtonHarness.with({selector: '.obt-notification-button'}))();
	}

	async getIcons(): Promise<MatIconHarness[]> {
		return this.locatorForAll(MatIconHarness)();
	}

	async openPopover(): Promise<void> {
		const buttons = await this.getMenuButton();
		await buttons.click();
	}

	async closePopover(): Promise<void> {
		const backdropLocator = this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-backdrop');
		const backdrop = await backdropLocator();
		if (backdrop) {
			await backdrop.click();
			await new Promise(resolve => {
				setTimeout(resolve, 100);
			});
		}
	}

	async isPopoverOpen(): Promise<boolean> {
		const popoverLocator = this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-container obt-tour-popover');
		const popover = await popoverLocator();
		return !!popover;
	}

	async getBadges(): Promise<number[]> {
		const badges = await this.locatorForAll('.obt-badge-new, .obt-badge-in-progress')();
		return Promise.all(badges.map(async badge => Number((await badge.text()).trim())));
	}
}
