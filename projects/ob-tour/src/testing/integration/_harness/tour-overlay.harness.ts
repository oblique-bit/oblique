import {ComponentHarness, TestElement} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {MatProgressBarHarness} from '@angular/material/progress-bar/testing';

/**
 * Harness for the obt-tour-overlay component.
 * Provides helpers for testing step navigation, progress,
 * dialog accessibility, and tour controls.
 */
export class TourOverlayHarness extends ComponentHarness {
	static hostSelector = 'obt-tour-overlay';

	async getDialog(): Promise<TestElement | null> {
		return this.locatorForOptional('[role="dialog"]')();
	}

	async getHeader(): Promise<TestElement | null> {
		return this.locatorForOptional('.obt-tour-overlay-header')();
	}

	async getFooter(): Promise<TestElement | null> {
		return this.locatorForOptional('.obt-tour-overlay-footer')();
	}

	async getProgressBar(): Promise<MatProgressBarHarness | null> {
		return this.locatorForOptional(MatProgressBarHarness)();
	}

	async getProgressLabel(): Promise<string | null> {
		const label = await this.locatorForOptional('#progress-label')();
		return label ? (await label.text()).trim() : null;
	}

	async getStepTitle(type: string): Promise<string | null> {
		const title = await this.locatorForOptional(`obt-tour-list-title-${type}`)();
		return title ? (await title.text()).trim() : null;
	}

	async getStepDescription(): Promise<string | null> {
		const desc = await this.locatorForOptional('.obt-tour-overlay-description')();
		return desc ? (await desc.text()).trim() : null;
	}

	async getAlertMessage(): Promise<string | null> {
		const alert = await this.locatorForOptional('.obt-tour-overlay-empty p')();
		return alert ? (await alert.text()).trim() : null;
	}

	async getFocusTrap(): Promise<TestElement | null> {
		return this.locatorForOptional('[cdkTrapFocus]')();
	}
	async getCloseButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({selector: '#obt-menu-close-button'}))();
	}

	async clickCloseButton(): Promise<void> {
		const btn = await this.getCloseButton();
		if (btn) {
			await btn.click();
		}
	}

	async getNextButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({text: /i18n\.ob-tour\.overlay\.button\.label\.next/i}))();
	}

	async clickActionButtonById(id: string): Promise<void> {
		const button = await this.documentRootLocatorFactory().locatorForOptional(`#${id}`)();
		if (!button) {
			throw new Error(`Button with id ${id} not found`);
		}
		await button.click();
	}

	async getPreviousButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({text: /i18n\.ob-tour\.overlay\.button\.label\.previous/i}))();
	}

	async getFinishButton(): Promise<MatButtonHarness | null> {
		return this.locatorForOptional(MatButtonHarness.with({text: /i18n\.ob-tour\.overlay\.button\.label\.finish/i}))();
	}

	async clickNextButton(): Promise<void> {
		const btn = await this.getNextButton();
		if (btn) {
			await btn.click();
		}
	}

	async clickPreviousButton(): Promise<void> {
		const btn = await this.getPreviousButton();
		if (btn) {
			await btn.click();
		}
	}

	async clickFinishButton(): Promise<void> {
		const btn = await this.getFinishButton();
		if (btn) {
			await btn.click();
		}
	}
	async getCloseButtonTooltip(): Promise<string | null> {
		const tooltip = await this.locatorForOptional(MatTooltipHarness.with({selector: '#obt-menu-close-button'}))();
		if (!tooltip) {
			return null;
		}
		await tooltip.show();
		return (await tooltip.getTooltipText()).trim();
	}

	async getActiveTooltipForButton(selector: string): Promise<string | null> {
		const tooltip = await this.locatorForOptional(MatTooltipHarness.with({selector}))();
		if (!tooltip) {
			return null;
		}
		await tooltip.show();
		return (await tooltip.getTooltipText()).trim();
	}

	async getProgressValue(): Promise<number | null> {
		const progressBar = await this.getProgressBar();
		if (!progressBar) {
			return null;
		}
		const value = await progressBar.getValue();
		return Number(value);
	}

	async hasDialogRole(): Promise<boolean> {
		const dialog = await this.getDialog();
		if (!dialog) {
			return false;
		}
		const role = await dialog.getAttribute('role');
		return role === 'dialog';
	}

	async hasFocusTrap(): Promise<boolean> {
		return !!(await this.getFocusTrap());
	}
}
