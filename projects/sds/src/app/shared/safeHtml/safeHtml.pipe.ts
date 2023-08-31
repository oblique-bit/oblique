import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pipe, PipeTransform, inject} from '@angular/core';

@Pipe({name: 'safeHtml', standalone: true})
export class SafeHtmlPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

	public transform(value: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(value);
	}
}
