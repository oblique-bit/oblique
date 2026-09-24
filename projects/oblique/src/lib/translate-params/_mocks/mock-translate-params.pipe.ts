import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Pipe({
	name: 'obTranslateParams',
})
export class ObMockTranslateParamsPipe implements PipeTransform {
	transform(value: string, params?: any): string {
		return value;
	}
}
