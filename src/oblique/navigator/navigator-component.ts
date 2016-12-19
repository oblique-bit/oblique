import {NavigatorController} from './navigator-controller';

/**
 * Provides a clickable control for state navigation and binds ESC for UP navigation.
 *
 * @binding `direction` specifies navigation direction (`up` or `back`)
 */
export class NavigatorComponent implements ng.IComponentOptions {
	controller = NavigatorController;
	controllerAs = 'orNavigatorCtrl';
	bindings = {
		direction: '='
	};
	template = `<a href="" ng-click="orNavigatorCtrl.navigate(orNavigatorCtrl.direction)">
				    <ng-transclude></ng-transclude>
				</a>`;
	transclude = true;
}
