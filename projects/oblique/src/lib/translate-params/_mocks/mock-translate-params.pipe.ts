import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'obTranslateParams',
	standalone: true
})
export class ObMockTranslateParamsPipe implements PipeTransform {
	transform(value: string, params?: any): string {
		return value;
	}
}
