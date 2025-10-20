import {BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObtTourState, TOUR_STATES} from '../../../lib/models/tour.model';

export interface MenuListHarnessFilters extends BaseHarnessFilters {
	listTitle?: string;
	listType?: ObtTourState;
}

export type ActionButtonLabelKeys =
	| 'i18n.ob-tour.tour-menu.list.button.aria.start'
	| 'i18n.ob-tour.tour-menu.list.button.aria.resume'
	| 'i18n.ob-tour.tour-menu.list.button.aria.restart'
	| 'i18n.ob-tour.tour-menu.list.button.aria.skip';

export class ObtMenuListHarness extends ComponentHarness {
	static hostSelector = 'obt-menu-list';
	readonly states = TOUR_STATES;
	static with(filters: MenuListHarnessFilters = {}): HarnessPredicate<ObtMenuListHarness> {
		const predicate = new HarnessPredicate(ObtMenuListHarness, filters);

		if (filters.listTitle) {
			predicate.addOption('listTitle', filters.listTitle, async (harness, expectedTitle) => {
				const actualTitle = await harness.getListTitleText();
				return actualTitle.trim() === expectedTitle.trim();
			});
		}

		if (filters.listType) {
			predicate.addOption('listType', filters.listType, async (harness, expectedType) => {
				const titleText = await harness.getListTitleText(expectedType);
				return !!titleText;
			});
		}

		return predicate;
	}
	async clickActionButtonById(id: string): Promise<void> {
		const button = await this.locatorForOptional(`#${id}`)();
		if (!button) {
			throw new Error(`Button with id ${id} not found in list`);
		}
		await button.click();
	}
	async getListTitleText(listType?: ObtTourState): Promise<string> {
		const selector = listType ? `#obt-tour-list-title-${listType}` : '.obt-tour-list-title';
		const titleElement = await this.locatorForOptional(selector)();
		return titleElement ? titleElement.text() : '';
	}

	async getListItemCount(): Promise<number> {
		const items = await this.locatorForAll('.obt-tour-list-item')();
		return items.length;
	}

	async getActionButtons(): Promise<MatButtonHarness[]> {
		return this.locatorForAll(MatButtonHarness.with({selector: '.action-button'}))();
	}

	async getActionButtonById(id: string): Promise<MatButtonHarness | null> {
		return this.documentRootLocatorFactory().locatorForOptional(MatButtonHarness.with({selector: `#${id}`}))();
	}

	async getActionButtonByAriaLabel(label: ActionButtonLabelKeys | string): Promise<MatButtonHarness | null> {
		const buttons = await this.getActionButtons();
		for (const button of buttons) {
			// eslint-disable-next-line no-await-in-loop
			const host = await button.host();
			// eslint-disable-next-line no-await-in-loop
			const aria = await host.getAttribute('aria-label');
			if (aria?.trim() === label.trim()) {
				return button;
			}
		}
		return null;
	}

	async getActionButtonByNameOrNull(actionName: 'start' | 'resume' | 'restart' | 'skip'): Promise<MatButtonHarness | null> {
		const label = `i18n.ob-tour.tour-menu.list.button.aria.${actionName}`;
		return this.getActionButtonByAriaLabel(label);
	}

	async clickActionByAriaLabel(label: ActionButtonLabelKeys | string): Promise<void> {
		const button = await this.getActionButtonByAriaLabel(label);
		if (button) {
			await button.click();
		}
	}

	async getIcons(): Promise<MatIconHarness[]> {
		return this.locatorForAll(MatIconHarness)();
	}

	async getPopoverCloseButton(): Promise<MatButtonHarness | null> {
		const popoverRoot = this.documentRootLocatorFactory();
		return popoverRoot.locatorForOptional(MatButtonHarness.with({selector: 'obt-tour-popover button[aria-label="close"]'}))();
	}

	async getPopoverCloseAriaLabel(): Promise<string | null> {
		const btn = await this.getPopoverCloseButton();
		if (!btn) {
			return null;
		}
		const host = await btn.host();
		return host.getAttribute('aria-label');
	}

	async getListItem(index: number): Promise<TestElement> {
		const items = await this.locatorForAll('.obt-tour-list-item')();
		return items[index];
	}
}
