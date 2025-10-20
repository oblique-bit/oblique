import {ComponentHarness} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {ObtTourAction} from '../../../lib/models/tour.model';

/**
 * Harness for the <obt-action-button> component.
 * Supports reading aria-labels, tooltips and icon names.
 */
export class ObtActionButtonHarness extends ComponentHarness {
	static hostSelector = 'obt-action-button';

	async getButton(): Promise<MatButtonHarness> {
		return this.locatorFor(MatButtonHarness.with({selector: '.action-button'}))();
	}

	async getAriaLabel(): Promise<string | null> {
		const button = await this.getButton();
		const host = await button.host();
		return host.getAttribute('aria-label');
	}

	async getTooltipText(): Promise<string | null> {
		const button = await this.getButton();
		const host = await button.host();
		return host.getAttribute('mattooltip') ?? null;
	}

	async getIcon(): Promise<MatIconHarness | null> {
		return this.locatorForOptional(MatIconHarness)();
	}

	async getIconName(): Promise<string | null> {
		const icon = await this.getIcon();
		if (!icon) {
			return null;
		}
		return icon.getName();
	}

	async getScreenReaderLabel(): Promise<string | null> {
		const sr = await this.locatorForOptional('.ob-screen-reader-only')();
		return sr ? sr.text() : null;
	}

	async click(): Promise<void> {
		const button = await this.getButton();
		await button.click();
	}
	async clickByActionType(action: ObtTourAction): Promise<void> {
		const expectedLabel = `i18n.ob-tour.tour-menu.list.button.aria.${action}`;
		const aria = await this.getAriaLabel();
		if (aria?.includes(expectedLabel)) {
			await this.click();
		}
	}
}
