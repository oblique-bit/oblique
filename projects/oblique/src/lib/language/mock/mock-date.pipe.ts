import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obDate'
})
export class ObMockDatePipe implements PipeTransform {
	transform(value: string | number | Date, format = 'datetime', timezone?: string): string {
		return '';
	}
}
