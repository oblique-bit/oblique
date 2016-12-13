import {NavigationDirectiveController} from './navigator-directive-controller';

/**
 * Provides a link control for state navigation and binds ESC for UP navigation.
 *
 * @scope `direction` specifies navigation direction (`up` or `back`)
 */
export class NavigatorDirective implements ng.IDirective {
	restrict = 'E';
	replace = true;
	require = 'navigator';
	transclude = true;
	template = `<a href="" ng-click="navigate()">
				    <ng-transclude></ng-transclude>
				</a>`;

	controller = NavigationDirectiveController;
	controllerAs = 'orNavigationCtrl';

	constructor(private $document:ng.IDocumentService) {
	}

	link = (scope, element, attrs, ctrl:NavigationDirectiveController) => {
		let events = {
			up: 'keyup.navigator'
		};

		scope.navigate = (direction: string = attrs.direction || 'up') => {
			ctrl.navigate(direction);
		};

		this.$document.on(events.up, (event) => {
			if (event.which === 27) { // ESC key
				event.preventDefault();
				scope.navigate('up');
			}
		});

		element.on('$destroy', () => {
			this.$document.off(events.up);
		});
	};


}
