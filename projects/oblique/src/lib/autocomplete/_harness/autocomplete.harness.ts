import {
	AsyncFactoryFn,
	BaseHarnessFilters,
	ContentContainerComponentHarness,
	HarnessPredicate,
	TestElement,
	TestKey,
} from '@angular/cdk/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';

export class ObAutocompleteHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-autocomplete';

	protected getFormField: AsyncFactoryFn<TestElement> = this.locatorFor('mat-form-field');
	protected getOptions: AsyncFactoryFn<TestElement[]> = this.documentRootLocatorFactory().locatorForAll('mat-option');
	protected getOptionGroup: AsyncFactoryFn<TestElement[]> =
		this.documentRootLocatorFactory().locatorForAll('mat-optgroup');

	static with(options: ObAutocompleteFilters): HarnessPredicate<ObAutocompleteHarness> {
		return new HarnessPredicate<ObAutocompleteHarness>(ObAutocompleteHarness, options)
			.addOption('text in input value', options.searchText, (harness, text) =>
				HarnessPredicate.stringMatches(harness.getInputValue(), text)
			)
			.addOption('label of form-field', options.formLabel, (harness, text) =>
				HarnessPredicate.stringMatches(harness.getFormLabel(), text)
			);
	}

	async getFormLabel(): Promise<string> {
		const formFieldHarness = await this.getHarness(MatFormFieldHarness);
		return formFieldHarness.getLabel();
	}

	async openAutocompletePanel(): Promise<void> {
		const inputHarness = await this.getHarness(MatInputHarness);
		await inputHarness.focus();
		await (await inputHarness.host()).sendKeys(TestKey.DOWN_ARROW);
		await this.forceStabilize();
		await this.waitForTasksOutsideAngular();
		await new Promise(resolve => {
			setTimeout(resolve, 300);
		});
		await this.forceStabilize();
	}

	async closeAutocompletePanel(): Promise<void> {
		const inputHarness = await this.getHarness(MatInputHarness);
		return inputHarness.blur();
	}

	async openPanelAndGetAllOptions(): Promise<TestElement[]> {
		await this.openAutocompletePanel();
		return this.getOptions();
	}

	async openPanelAndGetAllOptionGroups(): Promise<TestElement[]> {
		await this.openAutocompletePanel();
		return this.getOptionGroup();
	}

	async getInputValue(): Promise<string> {
		const inputHarness = await this.getHarness(MatInputHarness);
		return inputHarness.getValue();
	}

	async getInputElement(): Promise<TestElement> {
		const inputHarness = await this.getHarness(MatInputHarness);
		return inputHarness.host();
	}

	async getFormFieldElement(): Promise<TestElement> {
		return this.getFormField();
	}
}

export interface ObAutocompleteFilters extends BaseHarnessFilters {
	searchText?: string | RegExp;
	formLabel?: string | RegExp;
}
