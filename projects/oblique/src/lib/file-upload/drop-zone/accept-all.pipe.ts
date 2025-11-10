import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obAcceptAll',
	standalone: true,
})
export class ObAcceptAllPipe implements PipeTransform {
	transform(allowedTypes: string[]): boolean {
		return !allowedTypes?.length || allowedTypes.includes('*');
	}
}
