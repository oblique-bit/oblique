import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class MockTranslatePipe implements PipeTransform {
	transform(value: number): number {
		return value;
	}
}
