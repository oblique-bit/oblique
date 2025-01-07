import {AfterViewInit, Component, ElementRef, ViewChild, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {obFocusWithOutline} from '@oblique/oblique';

@Component({
	selector: 'sb-focus-sample',
	templateUrl: './focus-sample.component.html',
	styleUrls: ['./focus-sample.component.scss'],
	standalone: false
})
export class FocusSampleComponent implements AfterViewInit {
	@ViewChild('card', {read: ElementRef})
	public readonly card!: ElementRef;

	@ViewChild('contentEditable')
	public readonly contentEditable!: ElementRef;

	@ViewChild('input')
	private readonly input!: ElementRef;

	@ViewChild('select', {read: ElementRef})
	private readonly select!: ElementRef;

	@ViewChild('textArea')
	private readonly textArea!: ElementRef;

	private readonly document = inject(DOCUMENT);

	private focusableElements = [];

	private index = 0;

	ngAfterViewInit(): void {
		this.focusableElements = [this.card, this.contentEditable, this.input, this.select, this.textArea];
	}

	focusNext(): void {
		const activeElement = this.focusableElements[this.index];
		obFocusWithOutline(this.document, activeElement.nativeElement);
		this.index = (this.index + 1) % this.focusableElements.length;
	}
}
