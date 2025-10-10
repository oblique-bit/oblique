import {BaseHarnessFilters, ComponentHarness, HarnessPredicate} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObTourState, TOUR_STATES} from '../../lib/models/tour-config.model';

export interface MenuListHarnessFilters extends BaseHarnessFilters {
	listTitle?: string;
	listType?: ObTourState;
}

export type ActionButtonLabelKeys =
	| 'i18n.ob-tour.tour-menu.list.button.aria.start'
	| 'i18n.ob-tour.tour-menu.list.button.aria.resume'
	| 'i18n.ob-tour.tour-menu.list.button.aria.skip';

export class ObtMenuListHarness extends ComponentHarness {
	static hostSelector = 'obt-menu-list';
	readonly states = TOUR_STATES;

	static with(filters: MenuListHarnessFilters = {}): HarnessPredicate<ObtMenuListHarness> {
		return new HarnessPredicate(ObtMenuListHarness, filters)
			.addOption('listTitle', filters.listTitle, async (harness, expectedTitle) => {
				const actual = await harness.getListTitleText(filters.listType);
				return actual === expectedTitle;
			})
			.addOption('listType', filters.listType, async (harness, expectedType) => {
				const element = await harness.locatorForOptional(`#obt-tour-list-title-${expectedType}`)();
				return !!element;
			});
	}

	async getListTitleText(listType?: ObTourState): Promise<string> {
		const selector = listType ? `#obt-tour-list-title-${listType}` : '.obt-tour-list-title';
		const titleElement = await this.locatorForOptional(selector)();
		return titleElement ? titleElement.text() : '';
	}

	async getListItemCount(): Promise<number> {
		const items = await this.locatorForAll('.tour-list-item')();
		return items.length;
	}

	async getActionButtons(): Promise<MatButtonHarness[]> {
		return this.locatorForAll(MatButtonHarness)();
	}

	async getActionButtonByAriaLabel(label: ActionButtonLabelKeys | string): Promise<MatButtonHarness | null> {
		const buttons = await this.getActionButtons();
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		return buttons.find(async (button: MatButtonHarness) => {
			const host = await button.host();
			const aria = await host.getAttribute('aria-label');
			return aria?.trim() === label.trim();
		});
	}

	async getActionButtonByLabel(label: ActionButtonLabelKeys | string): Promise<MatButtonHarness | null> {
		const aria = await this.getActionButtonByAriaLabel(label);
		return aria || null;
	}

	async getIcons(): Promise<MatIconHarness[]> {
		return this.locatorForAll(MatIconHarness)();
	}

	async clickActionByAriaLabel(ariaLabel: string): Promise<void> {
		const button = await this.locatorForOptional(`button[aria-label="${ariaLabel}"]`)();
		if (button) {
			await button.click();
		}
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
}
