import {ComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {ObtMenuListHarness} from './menu-list.harness';

export interface TourPopoverHarnessFilters {
	listType?: 'new' | 'inProgress' | 'done' | 'skipped';
}

export class TourPopoverHarness extends ComponentHarness {
	static hostSelector = '.cdk-overlay-container obt-tour-popover';

	/** Title of the popover dialog */
	async getDialogTitle(): Promise<string> {
		const title = await this.locatorForOptional('#obt-dialog-title')();
		return title ? (await title.text()).trim() : '';
	}

	/** The main close button at top right */
	async getCloseButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({selector: '#obt-menu-close-button'}))();
	}

	/** Tooltip text of the close button */
	async getCloseButtonTooltip(): Promise<string | null> {
		const tooltip = await this.locatorForOptional(MatTooltipHarness.with({selector: '#obt-menu-close-button'}))();
		if (!tooltip) {
			return null;
		}
		await tooltip.show();
		return (await tooltip.getTooltipText()).trim();
	}

	/** Clicks the close button */
	async clickCloseButton(): Promise<void> {
		const button = await this.getCloseButton();
		if (button) {
			await button.click();
		}
	}

	/** The clear button at bottom */
	async getClearButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({selector: '#obt-menu-clear-button'}))();
	}

	/** Clicks the clear button */
	async clickClearButton(): Promise<void> {
		const button = await this.getClearButton();
		if (button) {
			await button.click();
		}
	}

	/** Tooltip of the clear button */
	async getClearButtonTooltip(): Promise<string | null> {
		const tooltip = await this.locatorForOptional(MatTooltipHarness.with({selector: '#obt-menu-clear-button'}))();
		if (!tooltip) {
			return null;
		}
		await tooltip.show();
		return (await tooltip.getTooltipText()).trim();
	}

	/** All obt-menu-list sections within the popover */
	async getMenuLists(): Promise<ObtMenuListHarness[]> {
		return this.locatorForAll(ObtMenuListHarness)();
	}

	/** Gets a specific obt-menu-list by type (new, inProgress, done, skipped) */
	async getMenuListByType(type: 'new' | 'inProgress' | 'done' | 'skipped'): Promise<ObtMenuListHarness | null> {
		return this.locatorForOptional(ObtMenuListHarness.with({listType: type}))();
	}

	/** Returns all list titles inside the popover */
	async getAllListTitles(): Promise<string[]> {
		const lists = await this.getMenuLists();
		const titles = await Promise.all(lists.map(list => list.getListTitleText()));
		return titles.map(tour => tour.trim());
	}

	/** Returns root popover element */
	async getPopoverRoot(): Promise<TestElement> {
		return this.locatorFor('.obt-popover-content')();
	}
}
