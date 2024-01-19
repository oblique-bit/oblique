import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Pipe({
	name: 'obTranslateParams',
	standalone: true
})
export class ObMockTranslateParamsPipe implements PipeTransform {
	transform(value: string, params?: any): string {
		return value;
	}
}
