import {NavigatorService} from './navigator-service';

export class NavigationDirectiveController {
	/*@ngInject*/
	constructor(public $navigator:NavigatorService) {

	}

	navigate (direction:string = 'up') {
		if(direction === 'up'){
			return this.up();
		} else {
			return this.back();
		}
	};

	up() {
		return this.$navigator.up();
	}

	back () {
		return this.$navigator.back();
	}
}