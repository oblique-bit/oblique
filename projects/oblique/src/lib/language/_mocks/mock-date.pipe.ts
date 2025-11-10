import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Pipe({
	name: 'obDate',
	standalone: true,
})
export class ObMockDatePipe implements PipeTransform {
	transform(value: string | number | Date, format = 'datetime', timezone?: string): string {
		return '';
	}
}
