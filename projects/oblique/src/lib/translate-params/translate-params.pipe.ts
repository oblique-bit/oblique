import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
	name: 'orTranslateParams',
	pure: false
})
export class TranslateParamsPipe implements PipeTransform {

	constructor(private readonly translate: TranslateService) {
	}

	transform(value: string, params?: any): string {
		return this.translate.instant(value, typeof params === 'object' ? this.translateParams(params) : undefined);
	}

	private translateParams(params: Object): Object {
		return Object.keys(params)
			.filter(key => params[key] && typeof params[key] === 'string')
			.reduce((parameters, key) => ({...parameters, [key]: this.translate.instant(params[key])}), {});
	}}
