import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {ObNavigableOnChangeEvent} from '../navigable.module';

@Directive({
	selector: '[obNavigable]',
	exportAs: 'obNavigable'
})
export class ObMockNavigableDirective {
	@Input('obNavigable') model: any;
	@Input('navigableFocusOnInit') focusOnInit: boolean;
	@Output() navigableOnActivation = new EventEmitter();
	@Output() navigableOnChange = new EventEmitter<ObNavigableOnChangeEvent>();
	@Output() navigableOnFocus = new EventEmitter();
	@Output() navigableOnMouseDown = new EventEmitter();
	@Output() navigableOnMove = new EventEmitter();
	tabindex = 0;
	navigableClass = true;
	active = true;
	selected = false;
	@Input('navigableHighlight') highlight = false;
	@Input('navigableActivate') set activate(value: boolean) {
	}

	onKeyDown($event: KeyboardEvent): void {
	}

	onMouseDown($event: MouseEvent): void {
	}

	onFocus($event: FocusEvent): void {
	}

	focus(): void {
	}

	moveUp(): void {
	}

	moveDown(): void {
	}
}

