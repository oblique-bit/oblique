import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import hljs from 'highlight.js';
import {IdPipe} from '../../../shared/id/id.pipe';

@Component({
	selector: 'app-highlighted-code',
	templateUrl: './highlighted-code.component.html',
	styleUrls: ['./highlighted-code.component.scss'],
	standalone: true,
	imports: [IdPipe]
})
export class HighlightedCodeComponent implements AfterViewInit {
	@Input() idPrefix = '';
	@Input() codeBlock = '';

	componentId = 'highlighted-code';

	@ViewChild('code') private readonly code!: ElementRef<HTMLElement>;

	ngAfterViewInit(): void {
		/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
		hljs.configure({languages: ['html', 'scss', 'ts']});
		hljs.highlightElement(this.code.nativeElement);
		/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
	}
}
