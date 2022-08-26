import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obAcceptAll'
})
export class ObAcceptAllPipe implements PipeTransform {
	// "this: void" is not a parameter but rather a typescript feature that indicates that the function don't use "this"
	transform(this: void, allowedTypes: string[]): boolean {
		return !allowedTypes?.length || allowedTypes.includes('*');
	}
}
