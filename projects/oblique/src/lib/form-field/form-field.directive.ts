import {AfterContentInit, Directive, HostBinding, OnInit, inject} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-form-field',
	host: {class: 'ob-form-field'},
	standalone: true
})
export class ObFormFieldDirective implements OnInit, AfterContentInit {
	@HostBinding('class.ob-form-field-textarea') containsTextarea = false;
	@HostBinding('class.ob-form-field-has-mat-input-server') hasMatInputServer = false;
	@HostBinding('class.ob-form-field-has-required-marker') hasRequiredMarker = false;
	@HostBinding('class.ob-form-field-has-text-prefix') hasTextPrefix = false;
	@HostBinding('class.ob-form-field-has-text-suffix') hasTextSuffix = false;
	@HostBinding('class.ob-form-field-readonly') isReadonly = false;
	@HostBinding('class.ob-form-field-required') isRequired = false;

	private readonly matFormField = inject(MatFormField);
	// eslint-disable-next-line no-underscore-dangle
	private readonly host: HTMLElement = this.matFormField._elementRef.nativeElement;

	ngOnInit(): void {
		this.containsTextarea = this.hostContainsTextArea();
		this.hasMatInputServer = this.hasMatInputServerClass();
		this.hasRequiredMarker = this.hasRequiredMarkerClass();
		this.isReadonly = this.hasReadonlyAttribute();
		this.isRequired = this.hasRequiredAttribute();
	}

	ngAfterContentInit(): void {
		this.hasTextPrefix = this.hasTextPrefixClass();
		this.hasTextSuffix = this.hasTextSuffixClass();
	}

	private getHostInnerHTML(): string {
		return this.host.innerHTML;
	}

	private hasMatInputServerClass(): boolean {
		return this.hostInnerHTMLIncludes('mat-input-server');
	}

	private hasRequiredMarkerClass(): boolean {
		return this.hostInnerHTMLIncludes('mat-mdc-form-field-required-marker');
	}

	private hasTextPrefixClass(): boolean {
		// eslint-disable-next-line no-underscore-dangle
		return this.matFormField._hasTextPrefix;
	}

	private hasTextSuffixClass(): boolean {
		// eslint-disable-next-line no-underscore-dangle
		return this.matFormField._hasTextSuffix;
	}

	private hasReadonlyAttribute(): boolean {
		return this.hasInputMatSelectOrTextarea() && this.hostInnerHTMLIncludes('readonly');
	}

	private hasRequiredAttribute(): boolean {
		return (this.hasInputMatSelectOrTextarea() && this.hostInnerHTMLIncludes('required')) || this.hasRequiredValidationClass();
	}

	private hasInputMatSelectOrTextarea(): boolean {
		return this.hostInnerHTMLIncludes('<input') || this.hostInnerHTMLIncludes('<mat-select') || this.hostInnerHTMLIncludes('<textarea');
	}

	private hasRequiredValidationClass(): boolean {
		return this.hostInnerHTMLIncludes('ob-schema-required-validation');
	}

	private hostContainsTextArea(): boolean {
		return this.hostInnerHTMLIncludes('<textarea') && this.hostInnerHTMLIncludes('</textarea>');
	}

	private hostInnerHTMLIncludes(searchString: string): boolean {
		return this.getHostInnerHTML().includes(searchString);
	}
}
