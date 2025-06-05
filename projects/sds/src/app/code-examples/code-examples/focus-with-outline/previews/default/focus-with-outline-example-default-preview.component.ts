import {Component, ElementRef, Signal, computed, inject, viewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {ObButtonDirective, obFocusWithOutline} from '@oblique/oblique';

@Component({
	selector: 'app-focus-with-outline-example-default-preview',
	templateUrl: './focus-with-outline-example-default-preview.component.html',
	imports: [MatFormField, MatSelect, MatOption, MatLabel, MatButton, ObButtonDirective, MatInput]
})
export class FocusWithOutlineExampleDefaultPreviewComponent {
	private readonly input: Signal<ElementRef<HTMLElement>> = viewChild.required(MatInput, {read: ElementRef});
	private readonly select: Signal<ElementRef<HTMLElement>> = viewChild.required(MatSelect, {read: ElementRef});
	private readonly document = inject(DOCUMENT);
	private readonly focusableElements = computed(() => [this.input(), this.select()]);
	private index = 0;

	focusNext(): void {
		const activeElement = this.focusableElements()[this.index];
		obFocusWithOutline(this.document, activeElement.nativeElement);
		this.index = (this.index + 1) % this.focusableElements().length;
	}
}
