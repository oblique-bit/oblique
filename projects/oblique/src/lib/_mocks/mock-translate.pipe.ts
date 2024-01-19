import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Pipe({
	name: 'translate',
	standalone: true
})
export class ObMockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}
