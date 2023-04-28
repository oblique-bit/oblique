import {Pipe, PipeTransform} from '@angular/core';
import {ObServiceNavigationApplicationStatus} from '../service-navigation.model';

@Pipe({
	name: 'ObServiceNavigationApplicationAlt'
})
export class ObServiceNavigationApplicationAltPipe implements PipeTransform {
	transform(status: ObServiceNavigationApplicationStatus): string {
		switch (status) {
			case 'online':
				return 'i18n.oblique.service-navigation.applications.image.online.alt';
			case 'offline':
				return 'i18n.oblique.service-navigation.applications.image.offline.alt';
			case 'inaccessible':
				return 'i18n.oblique.service-navigation.applications.image.inaccessible.alt';
			default:
				throw new Error(`Illegal status: ${status as string}`);
		}
	}
}
