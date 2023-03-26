import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
	name: 'obSafeImage'
})
export class ObSafeImagePipe implements PipeTransform {
	constructor(private readonly sanitizer: DomSanitizer) {}

	transform(value: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustResourceUrl(value);
	}
}
