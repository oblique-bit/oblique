import {Pipe, PipeTransform, inject} from '@angular/core';
import {ObIServiceNavigationApplication} from '../service-navigation.model';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
	name: 'ObServiceNavigationApplicationNameStatus',
	standalone: false,
})
export class ObServiceNavigationApplicationNameStatusPipe implements PipeTransform {
	private readonly translateService = inject(TranslateService);

	transform(application: ObIServiceNavigationApplication): string {
		switch (application.status) {
			case 'online':
				return application.name;
			case 'offline':
				return `${application.name} - ${this.translateService.instant('i18n.oblique.service-navigation.applications.status.offline')}`;
			case 'inaccessible':
				return `${application.name} - ${this.translateService.instant('i18n.oblique.service-navigation.applications.status.inaccessible')}`;
			default:
				throw new Error(`Illegal status: ${application.status as string}`);
		}
	}
}
