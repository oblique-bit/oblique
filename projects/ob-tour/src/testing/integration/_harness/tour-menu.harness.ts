import {ComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObtMenuListHarness} from './menu-list.harness';
import {TourPopoverHarness} from './popover.harness';
import {TourOverlayHarness} from './tour-overlay.harness';

export class ObtTourHarness extends ComponentHarness {
	static hostSelector = 'obt-tour';

	async getSlideToggleHarness(): Promise<MatSlideToggleHarness> {
		return this.locatorFor(MatSlideToggleHarness)();
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
		if (!overlays?.length) {
			return false;
		}
		return Array.from(overlays).some(element => element.querySelector('obt-tour-popover'));
	}

	async getPopoverElement(): Promise<TestElement | null> {
		return this.documentRootLocatorFactory().locatorForOptional('.cdk-overlay-container obt-tour-popover')();
	}

	async getPopoverHarness(): Promise<TourPopoverHarness | null> {
		return this.documentRootLocatorFactory().locatorForOptional(TourPopoverHarness)();
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
		document.dispatchEvent(escapeEvent);
		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});
	}

	async getBadgesCount(): Promise<number[]> {
		const badges = await this.locatorForAll('.obt-badge-new, .obt-badge-in-progress')();
		return Promise.all(badges.map(async badge => Number((await badge.text()).trim())));
	}

	async getPopoverSectionCounts(): Promise<{new: number; inProgress: number; done: number; skipped: number}> {
		const popoverRoot = this.documentRootLocatorFactory();
		const harnesses = {
			new: await popoverRoot.locatorForOptional(ObtMenuListHarness.with({listType: 'new'}))(),
			inProgress: await popoverRoot.locatorForOptional(ObtMenuListHarness.with({listType: 'inProgress'}))(),
			done: await popoverRoot.locatorForOptional(ObtMenuListHarness.with({listType: 'done'}))(),
			skipped: await popoverRoot.locatorForOptional(ObtMenuListHarness.with({listType: 'skipped'}))()
		};
		const results = {new: 0, inProgress: 0, done: 0, skipped: 0};
		results.new = (await harnesses.new.getListItemCount()) ?? 0;
		results.done = (await harnesses.done.getListItemCount()) ?? 0;
		results.skipped = (await harnesses.skipped.getListItemCount()) ?? 0;
		results.inProgress = (await harnesses.inProgress.getListItemCount()) ?? 0;
		return results;
	}

	async getPopoverListTitles(): Promise<string[]> {
		const lists = await this.getPopoverLists();
		return Promise.all(lists.map(list => list.getListTitleText()));
	}

	async getStepsOverlayHarness(): Promise<TourOverlayHarness> {
		return this.documentRootLocatorFactory().locatorForOptional(TourOverlayHarness)();
	}
}
