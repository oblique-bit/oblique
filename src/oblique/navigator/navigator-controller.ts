import {NavigatorService} from './navigator-service';

/**
 * Controller for the Navigator component.
 *
 * @see NavigatorComponent
 */
export class NavigatorController implements ng.IComponentController {
	// Bindings:
	direction:string;

	/*@ngInject*/
	constructor(
		private $scope, private $element, private $attrs,
		private $timeout:ng.ITimeoutService,
		private $document:ng.IDocumentService,
		public $navigator:NavigatorService) {
	}

	$onInit() {
		let events = {
			up: 'keyup.navigator'
		};

		this.$document.on(events.up, (event) => {
			if (event.which === 27) { // ESC key
				event.preventDefault();
				this.navigate('up');
			}
		});

		this.$element.on('$destroy', () => {
			this.$document.off(events.up);
		});

		// Report all other component attributes to underlying anchor:
		// FIXME: better approach to simulate `replace` directive design?
		this.$timeout(() => {
			let anchor = this.$element.find('a').first();
			angular.forEach(this.$attrs.$attr, (key) => {
				if(key !== 'direction') {
					anchor.attr(key, this.$attrs[key]);
					this.$element.removeAttr(key);
				}
			});
		});
	}

	navigate (direction:string = this.direction || 'up') {
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