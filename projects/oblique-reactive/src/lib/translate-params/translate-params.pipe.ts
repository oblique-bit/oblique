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
		const translatedParams = Object.assign({}, params);
		Object.keys(translatedParams)
			.filter(key => translatedParams[key] && typeof translatedParams[key] === 'string')
			.forEach(key => {
				translatedParams[key] = this.translate.instant(translatedParams[key]);
			});
		return translatedParams;
	}}
