import {type AfterViewInit, Component, type ElementRef, input, viewChild} from '@angular/core';
import hljs from 'highlight.js';
import {IdPipe} from '../../../shared/id/id.pipe';

@Component({
	selector: 'app-highlighted-code',
	templateUrl: './highlighted-code.component.html',
	styleUrl: './highlighted-code.component.scss',
	imports: [IdPipe]
})
export class HighlightedCodeComponent implements AfterViewInit {
	readonly idPrefix = input('');
	readonly codeBlock = input('');

	componentId = 'highlighted-code';

	private readonly code = viewChild.required<ElementRef<HTMLElement>>('code');

	ngAfterViewInit(): void {
		hljs.configure({languages: ['html', 'scss', 'ts', 'json']});
		hljs.highlightElement(this.code().nativeElement);
	}
}
