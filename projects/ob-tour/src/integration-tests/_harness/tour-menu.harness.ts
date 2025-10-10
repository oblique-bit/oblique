import {ComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObtMenuListHarness} from './menu-list.harness';

export class ObtTourMenuHarness extends ComponentHarness {
	static hostSelector = 'obt-tour-menu';

	async getSlideToggleHarness(): Promise<MatSlideToggleHarness> {
		return this.locatorFor(MatSlideToggleHarness)();
	}

	async toggleOverviewVisibility(): Promise<void> {
		const toggle = await this.getSlideToggleHarness();
		await toggle.toggle();
	}

	async activateToggle(): Promise<void> {
		const toggle = await this.getSlideToggleHarness();
		await toggle.check();
	}

	async deactivateToggle(): Promise<void> {
		const toggle = await this.getSlideToggleHarness();
		await toggle.uncheck();
	}

	async isToggleChecked(): Promise<boolean> {
		const toggle = await this.getSlideToggleHarness();
		return toggle.isChecked();
	}

	async getNotificationContainer(): Promise<TestElement> {
		return this.locatorFor('.obt-notification')();
	}

	async getNotificationButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({selector: '.obt-notification-button'}))();
	}

	async getIcons(): Promise<MatIconHarness[]> {
		return this.locatorForAll(MatIconHarness)();
	}

	async openPopover(): Promise<void> {
		if (this.isPopoverOpen()) {
			return;
		}
		const button = await this.getNotificationButton();
		await button?.click();
	}

	async closePopover(): Promise<void> {
		const backdrop = await this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-backdrop')();
		if (backdrop) {
			await backdrop.click();
			await new Promise(resolve => {
				setTimeout(resolve, 100);
			});
		}
	}

	isPopoverOpen(): boolean {
		const overlays = document.querySelectorAll('.cdk-overlay-pane');
		return Array.from(overlays).some(overlay => overlay.querySelector('obt-tour-popover') !== null);
	}
	async getPopoverElement(): Promise<TestElement | null> {
		return this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-container obt-tour-popover')();
	}

	async getPopoverLists(): Promise<ObtMenuListHarness[]> {
		return this.documentRootLocatorFactory().locatorForAll(ObtMenuListHarness)();
	}

	async getPopoverCloseButton(): Promise<MatButtonHarness | null> {
		return this.documentRootLocatorFactory().locatorForOptional(
			MatButtonHarness.with({
				selector: '.cdk-overlay-container obt-tour-popover button#obt-menu-close-button'
			})
		)();
	}

	async getBadgeNewOrNull(): Promise<TestElement | null> {
		return this.locatorForOptional('.obt-badge-new')();
	}

	async getBadgeInProgressOrNull(): Promise<TestElement | null> {
		return this.locatorForOptional('.obt-badge-in-progress')();
	}

	async pressEscape(): Promise<void> {
		const escapeEvent = new KeyboardEvent('keyup', {key: 'Escape', bubbles: true});
		const overlayContainer = document.querySelector('.cdk-overlay-container') ?? document.body;
		overlayContainer.dispatchEvent(escapeEvent);
		await new Promise(resolve => {
			setTimeout(resolve);
		});
	}

	async getBadgesCount(): Promise<number[]> {
		const badges = await this.locatorForAll('.obt-badge-new, .obt-badge-in-progress')();
		return Promise.all(badges.map(async badge => Number((await badge.text()).trim())));
	}

	async getPopoverSectionCounts(): Promise<{new: number; inProgress: number; done: number}> {
		const popoverRoot = this.documentRootLocatorFactory();
		const counts = {new: 0, inProgress: 0, done: 0};

		for (const state of ['new', 'inProgress', 'done'] as const) {
			// eslint-disable-next-line no-await-in-loop
			const harness = await popoverRoot.locatorForOptional(ObtMenuListHarness.with({listType: state}))();
			if (harness) {
				// eslint-disable-next-line no-await-in-loop
				counts[state] = await harness.getListItemCount();
			}
		}
		return counts;
	}
}
