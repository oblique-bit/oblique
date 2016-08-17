import {NotificationService} from '../../../oblique/ui/notifications/notification-service';
import {Country} from '../../../custom-typings/country';

export class TypeaheadSampleController {
	selection:Country;

	/*@ngInject*/
	constructor (private notificationService:NotificationService, 
				 public countries:Country[]) {
	}

	search() {
		if (this.selection && this.selection.name) {
			this.notificationService.success('Selected country: ' + this.selection.name);
		}
	}

	onSelect($item, $model, $label) {
		console.log('Country selected:', $label);
	}
}
