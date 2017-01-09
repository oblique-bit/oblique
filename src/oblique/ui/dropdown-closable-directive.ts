export class DropdownClosableDirective implements ng.IDirective {
	restrict = 'A';

	constructor(private $timeout:ng.ITimeoutService) {

	}

	link = (scope, element) => {
		element.blur(() => {
			this.closeDropdown(element);
		});

		element.parent().find('a').blur(() => {
			this.closeDropdown(element);
		});
	};

	private closeDropdown(element) {
		this.$timeout(() => {
			let focused = element.parent().find(':focus');
			if (focused.length === 0) {
				element.attr('aria-expanded', false);
				element.parent().removeClass('open');
			}
		}, 0);
	}
}
