import {ElementRef} from '@angular/core';
import {ObFormFieldDirective} from './form-field.directive';

describe(`${ObFormFieldDirective.name}`, () => {
	const createElRef = (innerHTML: string): ElementRef => ({
		nativeElement: {
			innerHTML
		}
	});

	it('should correctly identify a non textarea form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.containsTextarea).toBeFalsy();
	});

	it('should correctly identify a textarea form field', () => {
		const directive = new ObFormFieldDirective(createElRef('<textarea placeholder="Mandatory" class="mat-mdc-input-element"></textarea>'));
		directive.ngOnInit();
		expect(directive.containsTextarea).toBeTruthy();
	});

	it('should correctly identify a non mat-input-server form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.hasMatInputServer).toBeFalsy();
	});

	it('should correctly identify a mat-input-server form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-input-server">')
		);
		directive.ngOnInit();
		expect(directive.hasMatInputServer).toBeTruthy();
	});

	it('should correctly identify a non required-marker form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.hasRequiredMarker).toBeFalsy();
	});

	it('should correctly identify a required-marker form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-form-field-required-marker">')
		);
		directive.ngOnInit();
		expect(directive.hasRequiredMarker).toBeTruthy();
	});

	it('should correctly identify a non readonly form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.isReadonly).toBeFalsy();
	});

	it('should correctly identify a readonly form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" readonly placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.isReadonly).toBeTruthy();
	});

	it('should correctly identify a non required form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.isRequired).toBeFalsy();
	});

	it('should correctly identify a required form field', () => {
		const directive = new ObFormFieldDirective(
			createElRef('<input type="text" matinput="" required placeholder="Multiline" class="mat-mdc-input-element">')
		);
		directive.ngOnInit();
		expect(directive.isRequired).toBeTruthy();
	});
});
