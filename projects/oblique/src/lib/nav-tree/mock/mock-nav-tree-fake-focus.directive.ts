import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
	selector: '[obNavTreeFakeFocus]'
})
export class ObMockNavTreeFakeFocusDirective {
	static readonly EVENT_TOGGLE_COLLAPSED = 'ob.navTree.item.toggleCollapsed';
	static readonly KEY_DOWN_DEBOUNCE_MILLIS = 10;
	static readonly KEY_CODES = {
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		ENTER: 'Enter'
	};

	static readonly INPUT_EVENTS = {
		KEY_DOWN: 'keydown',
		BLUR: 'blur'
	};

	static readonly CSS_CLASSES = {
		LINK_ACTIVE: 'active',
		FAKE_FOCUS: 'nav-tree-fake-focus'
	};

	static readonly CSS_SELECTORS = {
		LINK_ACTIVE: 'active',
		FAKE_FOCUS: 'nav-tree-fake-focus',
		ITEM_LINK: '.nav-link',
		ITEM_WRAPPER: '.nav-tree.expanded:not(.disabled) > li:not(.nav-header):not(.disabled)'
	};

	@Input('obNavTreeFakeFocus')
	set focusInputElement(element: any) {
	}

	fakeFocus(element: ElementRef): void {
	}
}
