import {NavigatorService} from './navigator-service';

export class NavigationDirectiveController {
	/*@ngInject*/
	constructor(private $navigator:NavigatorService) {

	}

	up() {
		this.$navigator.up();
	}
}