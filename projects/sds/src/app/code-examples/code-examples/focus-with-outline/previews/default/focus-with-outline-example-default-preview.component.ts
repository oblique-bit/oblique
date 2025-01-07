import {AfterViewInit, Component, ElementRef, ViewChild, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {ObButtonDirective, ObFormFieldDirective, ObSelectDirective, obFocusWithOutline} from '@oblique/oblique';

@Component({
	selector: 'app-focus-with-outline-example-default-preview',
	templateUrl: './focus-with-outline-example-default-preview.component.html',
	imports: [MatFormField, MatSelect, MatOption, MatLabel, MatButton, ObButtonDirective, ObFormFieldDirective, ObSelectDirective, MatInput]
})
export class FocusWithOutlineExampleDefaultPreviewComponent implements AfterViewInit {
	@ViewChild(MatInput, {read: ElementRef}) private readonly input!: ElementRef<HTMLElement>;
	@ViewChild(MatSelect, {read: ElementRef}) private readonly select!: ElementRef<HTMLElement>;
	private readonly document = inject(DOCUMENT);
	private readonly focusableElements: ElementRef<HTMLElement>[] = [];
	private index = 0;

	ngAfterViewInit(): void {
		this.focusableElements.push(this.input, this.select);
	}

	focusNext(): void {
		const activeElement = this.focusableElements[this.index];
		obFocusWithOutline(this.document, activeElement.nativeElement);
		this.index = (this.index + 1) % this.focusableElements.length;
	}
}
