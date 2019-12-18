import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orTranslateParams'})
export class MockTranslateParamsPipe implements PipeTransform {

	transform(value: string, params?: any): string {
		return '';
	}
}
