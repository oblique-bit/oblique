export class NavigableDirectiveController implements ng.IComponentController {
	model;
	navigableSelection:any[] = [];
	navigableHighlight:boolean;
	navigableActivate:boolean;
	navigableOnActivation:(ctrl:NavigableDirectiveController, model:any) => void;
	navigableOnMove:(event:JQueryKeyEventObject, model, up:boolean) => void;

	arrows = {
		up: 38,
		down: 40
	};

	/*@ngInject*/
	constructor(private $element:ng.IRootElementService,
	            private $scope) {
	}

	$onInit() {
		this.navigableOnActivation = this.navigableOnActivation || angular.noop;
		this.navigableOnMove = this.navigableOnMove || angular.noop;
	}

	activate(target, combine?:boolean, focus?:boolean) {
		this.deactivate(this.active());
		this.select(target, combine);
		(target || this.$element).addClass('navigable-active');

		if (focus) {
			//FIXME: uncomment and refactor when https://github.com/jquery/jquery/issues/2342
			//next.trigger('focus', [{navigable-focus: true}]);
			(target || this.$element).data('navigable-focus', true).focus();
		}

		this.$scope.$apply(() => {
			//todo: Api? What should the first param be? Was scope before
			this.navigableOnActivation(this, this.model);
		});
	}

	deactivate(target:JQuery) {
		(target || this.$element).removeClass('navigable-active');
	}

	select(target:JQuery, combine?:boolean) {
		if (!combine) {
			this.unselect(this.selected());
			this.$scope.$apply(() => {
				this.navigableSelection.length = 0;
			});
		}
		(target || this.$element).addClass('navigable-selected');
		this.selectionAdd();
	}

	unselect(target:JQuery) {
		(target || this.$element).removeClass('navigable-selected navigable-highlight');
		this.selectionRemove();
	}

	move(direction, combine) {
		let items = this.items();
		let active = this.active();
		let index = items.index(active);
		let next = null;

		if (direction === this.arrows.up) {
			next = items.eq(Math.max(index - 1, 0));
		} else if (direction === this.arrows.down) {
			next = items.eq(Math.min(index + 1, items.length));
		}

		if (next && next.length) {
			if (next.hasClass('navigable-selected')) {
				this.unselect(active);
			}

			// Trigger focus on next item in order to ensure activation is performed within the right scope:
			next.data('navigable-combine', combine).focus();
		}
	}

	range(target) {
		let items = this.items();
		let active = this.active();
		let from = items.index(active);
		let to = items.index(target || this.$element);
		let slice = items.slice(Math.min(from, to), Math.max(from, to) + 1);

		this.activate(target || this.$element, false, true);
		slice.trigger('select.navigable', true);
	}

	active() {
		return this.container().find('.navigable-active');
	}

	selected() {
		return this.container().find('.navigable-selected');
	}

	items() {
		return this.container().find('.navigable');
	}

	container() {
		// Container is retrieved on-demand to ensure `$element` has been already attached to DOM:
		return this.$element.closest('.navigable-group, body');
	}

	private selectionAdd() {
		if (!this.selectionContains(this.model)) {
			this.$scope.$apply(() => {
				this.navigableSelection.push(this.model);
			});
		}
	}

	private selectionRemove() {
		this.$scope.$apply(() => {
			this.navigableSelection.splice(this.navigableSelection.indexOf(this.model), 1);
		});
	}

	private selectionContains(item) {
		return this.navigableSelection.indexOf(item) > -1;
	}
}
