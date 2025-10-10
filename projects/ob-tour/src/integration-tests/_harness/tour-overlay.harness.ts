import {ComponentHarness, TestElement} from '@angular/cdk/testing';

export class TourOverlayHarness extends ComponentHarness {
	static hostSelector = 'obt-tour-overlay';

	async getDialog(): Promise<TestElement> {
		return this.locatorForOptional('[role="dialog"]')();
	}

	async getFocusTrap(): Promise<TestElement> {
		return this.locatorForOptional('[cdkTrapFocus]')();
	}

	async getAlert(): Promise<TestElement> {
		return this.locatorForOptional('[role="alert"]')();
	}
}
