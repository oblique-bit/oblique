import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orTranslateParams'})
export class MockTranslateParamsPipe implements PipeTransform {
	transform(value: string, args: {[key: string]: string}): string {
		if (typeof args === 'object') {
			Object.keys(args).forEach(key => {
				value.replace(`{{${key}}}`, args[key]);
			});
		}
		return value;
	}
}
