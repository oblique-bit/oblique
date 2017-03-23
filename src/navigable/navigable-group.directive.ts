import {Directive, Input, EventEmitter, Output, AfterViewInit, ContentChildren, QueryList} from '@angular/core';
import {NavigableDirective, NavigableOnChangeEvent, NavigableOnMoveEvent} from './navigable.directive';

/**
 * NavigableGroupDirective
 *
 * API:
 * - [(navigableGroup)]:any[]       The array containing all group items
 * - [(navigableSelection)]:any[]   The array which will contain the selected models
 *
 */
@Directive({
	selector: '[navigableGroup]'
})
export class NavigableGroupDirective implements AfterViewInit {

	@Input('navigableGroup') items: any[];

	@ContentChildren(NavigableDirective) navigableDirectiveChildren: QueryList<NavigableDirective>;

	@Input('navigableSelection')
	get navigableSelection() {
		return this.navigableSelectionValue;
	}

	set navigableSelection(val: any[]) {
		this.navigableSelectionValue = val;
		this.navigableSelectionChange.emit(this.navigableSelectionValue);
	}

	/**
	 * Used for Two-Way databinding:
	 *      https://blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html
	 */
	private navigableSelectionValue: any[];


	//TODO: consider this:
	//Note: this would probably not be required, because we do not change the reference
	//      but it can help for future two-way databindings
	@Output('navigableSelectionChange') navigableSelectionChange = new EventEmitter();

	ngAfterViewInit(): void {
		this.navigableDirectiveChildren.forEach(child => {

			child.navigableOnChange.subscribe((event: NavigableOnChangeEvent) => {
				this.handleChildChange(child, event);
			});

			child.navigableOnMouseDown.subscribe((event: MouseEvent) => {
				this.handleChildMouseDown(child, event);
			});

			child.navigableOnFocus.subscribe(() => {
				this.handleChildFocus(child);
			});

			child.navigableOnMove.subscribe((event: NavigableOnMoveEvent) => {
				if(!event.prevented) {
					this.handleChildMove(child, event);
				}
			});
		});
	}

	private handleChildChange(child: NavigableDirective, event: NavigableOnChangeEvent) {
		let index = this.getIndexOfChild(child);
		let next: NavigableDirective = null;

		if (event.keyCode === NavigableDirective.KEYS.UP) {
			next = this.getChildAtIndex(Math.max(index - 1, 0));
		} else if (event.keyCode === NavigableDirective.KEYS.DOWN) {
			next = this.getChildAtIndex(Math.min(index + 1, this.navigableDirectiveChildren.length));
		}

		if (next) {
			if (next.selected) {
				this.unselectChild(child);
			}

			this.activateChild(next, event.combine);
			next.focus();
		}
	}

	private handleChildMouseDown(child, event: MouseEvent) {
		if (event && event.ctrlKey) {
			if (!child.selected) {
				this.activateChild(child, true);
			} else {
				this.deactivateChild(child);
				this.unselectChild(child);
				event.preventDefault();
			}
		} else if (event && event.shiftKey) {
			event.preventDefault();
			this.selectChildRange(child);
		} else {
			this.activateChild(child);
		}
	}

	private handleChildFocus(child: NavigableDirective) {
		if (!child.activate) {
			this.activateChild(child);
		}
	}

	private handleChildMove(child: NavigableDirective, event: NavigableOnMoveEvent) {
		let from = this.getIndexOfChild(child);

		if (event.keyCode === NavigableDirective.KEYS.UP) {
			let to = from - 1;
			if(to >= 0) {
				this.items.splice(to, 0, this.items.splice(from, 1)[0]);
			}
		} else if (event.keyCode === NavigableDirective.KEYS.DOWN) {
			let to = from + 1;
			if(to < this.items.length) {
				this.items.splice(to, 0, this.items.splice(from, 1)[0]);
			}
		}
	}

	private activateChild(child: NavigableDirective, combine?: boolean) {
		this.navigableDirectiveChildren.forEach(child => this.deactivateChild(child)); //TODO: take a look at this
		child.activate = true;
		this.selectChild(child, combine);
	}

	private deactivateChild(child: NavigableDirective) {
		child.activate = false;
	}

	private selectChild(child: NavigableDirective, combine?: boolean) {
		if (!combine) {
			this.navigableDirectiveChildren.forEach(child => this.unselectChild(child));
		}
		child.selected = true;
		this.selectionAddChild(child);
	}

	private unselectChild(child: NavigableDirective) {
		child.selected = false;
		this.selectionRemoveChild(child);
	}

	private selectChildRange(targetChild: NavigableDirective) {
		let from = this.getIndexOfChild(this.getActivatedChild());
		let to = this.getIndexOfChild(targetChild);
		let slice = this.navigableDirectiveChildren.toArray().slice(Math.min(from, to), Math.max(from, to) + 1);

		this.activateChild(targetChild);

		slice.forEach(child => this.selectChild(child, true));
		targetChild.focus();
	}

	private selectionAddChild(child) {
		if (!this.selectionContainsChild(child)) {
			this.navigableSelection.push(child.model);
		}
	}

	private selectionRemoveChild(child) {
		this.navigableSelection.splice(this.navigableSelection.indexOf(child.model), 1);
	}

	private selectionContainsChild(child) {
		return this.navigableSelection.indexOf(child.model) > -1;
	}

	private getActivatedChild() {
		return this.navigableDirectiveChildren.toArray().filter(child => child.activate)[0];
	}

	private getChildAtIndex(index: number): NavigableDirective {
		return this.navigableDirectiveChildren.toArray()[index];
	}

	private getIndexOfChild(child: NavigableDirective): number {
		return this.navigableDirectiveChildren.toArray().indexOf(child);
	}
}
