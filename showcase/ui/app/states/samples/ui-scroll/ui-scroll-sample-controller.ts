import {NotificationService} from 'oblique-reactive/oblique-reactive';
import {Country} from '../../../custom-typings/country';

export class UiScrollSampleController {
	selection:Country[] = [];

	datasource:ng.ui.IScrollDatasource<Country> = {
		get: (index, count, success) => {
			let from = index - 1;
			let to = from + count;
			let result = this.countries.slice(from, to);
			return success(result);
		}
	};

	datasourceAdapter:ng.ui.IScrollAdapter;

	/*@ngInject*/
	constructor(private notificationService:NotificationService,
	            private countries:Country[]) {
	}

	remove(country) {
		_.remove(this.countries, country);
		this.datasourceAdapter.applyUpdates((item, scope) => {
			if (item.code === country.code) {
				return [];
			}
		});
		this.notificationService.success('Country removed: ' + country.name);
	}

}
