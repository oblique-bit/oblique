import {Pipe, type PipeTransform} from '@angular/core';

@Pipe({
	name: 'relatedLink',
})
export class RelatedLinkPipe implements PipeTransform {
	transform(value: string): string {
		return value
			.split('/')
			.filter(item => Boolean(item))
			.pop();
	}
}
