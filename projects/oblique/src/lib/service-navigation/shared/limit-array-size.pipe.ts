import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obLimitArraySize'
})
export class ObLimitArraySizePipe implements PipeTransform {
	transform(array: unknown[], length: number): unknown[] {
		return array.slice(0, Math.max(0, length));
	}
}
