import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obAcceptAll'
})
export class ObAcceptAllPipe implements PipeTransform {
	transform(allowedTypes: string[]): boolean {
		return !allowedTypes || !allowedTypes.length || allowedTypes.includes('*');
	}
}
