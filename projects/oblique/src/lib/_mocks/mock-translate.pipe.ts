import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class ObMockTranslatePipe implements PipeTransform {
	transform(value: number): number {
		return value;
	}
}
