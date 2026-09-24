import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Pipe({
	name: 'translate',
})
export class ObMockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}
