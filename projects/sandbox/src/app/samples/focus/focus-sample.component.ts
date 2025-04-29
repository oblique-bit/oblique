import {type AfterViewInit, Component, ElementRef, inject, viewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {obFocusWithOutline} from '@oblique/oblique';

@Component({
	selector: 'sb-focus-sample',
	templateUrl: './focus-sample.component.html',
	styleUrl: './focus-sample.component.scss',
	standalone: false
})
export class FocusSampleComponent implements AfterViewInit {
	readonly card = viewChild.required('card', {read: ElementRef});

	readonly contentEditable = viewChild.required<ElementRef>('contentEditable');

	readonly input = viewChild.required<ElementRef>('input');

	readonly select = viewChild.required('select', {read: ElementRef});

	readonly textArea = viewChild.required<ElementRef>('textArea');

	private readonly document = inject(DOCUMENT);

	private focusableElements = [];

	private index = 0;

	ngAfterViewInit(): void {
		this.focusableElements = [this.card(), this.contentEditable(), this.input(), this.select(), this.textArea()];
	}

	focusNext(): void {
		const activeElement = this.focusableElements[this.index];
		obFocusWithOutline(this.document, activeElement.nativeElement);
		this.index = (this.index + 1) % this.focusableElements.length;
	}
}
