import {AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

export class ObPreventableEvent {
	public prevented = false;
}

export class ObNavigableOnChangeEvent extends ObPreventableEvent {
	constructor(public code: string, public combine: boolean) {
		super();
	}
}

export class ObNavigableOnMoveEvent extends ObPreventableEvent {
	constructor(public code: string) {
		super();
	}
}

/**
 * @deprecated since version 5.0.0. This module is complex, buggy and never used as intended. It will be removed without replacement in future version.
 * If you have a use case for it, please contact oblique@bit.admin.ch.
 * * to use the keyboard navigation, add a <code>tabindex</code> on each element and navigate with <kbd>tab</tbd> or <kbd>shift</tbd> + <kbd>tab</tbd>
 * * to use the hover effect on buttons use the <code>hover-visible</code> class.
 * * to use the multiple items selection, use the <code>obSelectable</code> directive
 * * the items reordering feature will be lost, but is incomplete anyway
 */
@Directive({
	selector: '[obNavigable]',
	exportAs: 'obNavigable'
})
export class ObNavigableDirective implements AfterViewInit {
	@Input('obNavigable')
	model: any;

	@Input('navigableFocusOnInit')
	focusOnInit: boolean;

	@Output()
	navigableOnActivation = new EventEmitter();

	@Output()
	navigableOnChange = new EventEmitter<ObNavigableOnChangeEvent>();

	@Output()
	navigableOnFocus = new EventEmitter();

	@Output()
	navigableOnMouseDown = new EventEmitter();

	@Output()
	navigableOnMove = new EventEmitter();

	@HostBinding('tabindex')
	tabindex = 0;

	@HostBinding('class.navigable')
	navigableClass = true;

	@HostBinding('class.navigable-selected')
	selected = false;

	@Input('navigableHighlight')
	@HostBinding('class.navigable-highlight')
	highlight = false;

	@Input('navigableActivate')
	set activate(value: boolean) {
		setTimeout(() => {
			this.active = value;
		});
	}

	@HostBinding('class.navigable-active')
	get active() {
		return this.activatedValue;
	}

	set active(value: boolean) {
		this.activatedValue = value;
		if (value) {
			this.selected = true;
			this.navigableOnActivation.emit();
		}
	}

	private activatedValue = false;

	constructor(private readonly element: ElementRef) {}

	ngAfterViewInit(): void {
		// This makes sure, that parent components are able to
		// subscribe to focus events before it gets triggered on init:
		setTimeout(() => {
			if (this.focusOnInit) {
				this.focus();
			}
		}, 0);
	}

	@HostListener('keydown', ['$event'])
	onKeyDown($event: KeyboardEvent) {
		const code = $event.code;
		if (code === 'ArrowUp' || code === 'ArrowDown') {
			const focused = this.element.nativeElement.querySelector(':focus');
			if (!focused || (!focused.classList.contains('dropdown-toggle') && !ObNavigableDirective.hasAncestorClass(focused, 'dropdown-menu'))) {
				$event.preventDefault();

				if ($event.ctrlKey && $event.shiftKey) {
					this.navigableOnMove.emit(new ObNavigableOnMoveEvent(code));

					// Try to restore focus:
					setTimeout(() => {
						(focused || this).focus();
					}, 0);
				} else {
					this.navigableOnChange.emit(new ObNavigableOnChangeEvent(code, $event.ctrlKey || $event.shiftKey));
				}
			}
		}
	}

	/**
	 * Using `mousedown` instead of `click` event
	 * to ensure it is triggered before focus event!
	 *
	 * Note: `focus` events do not propagate keyboard modifiers (CTRL, SHIFT, etc.)
	 */
	@HostListener('mousedown', ['$event'])
	onMouseDown($event: MouseEvent) {
		// Notify listeners:
		this.navigableOnMouseDown.emit($event);

		// Check that event does not originate from a focusable child element:
		const target = $event.target || $event.currentTarget;
		if (target === this.element.nativeElement || !ObNavigableDirective.isFocusable(target)) {
			if (!$event.defaultPrevented) {
				if ($event && $event.shiftKey) {
					this.active = true;
					$event.preventDefault(); // This prevents text selection as we are holding the SHIFT key...
					this.focus(); // ...but then focus needs to be manually restored.
				} else if ($event && $event.ctrlKey && this.selected) {
					$event.preventDefault(); // Ensure focus event is not triggered!
					this.active = false;
					this.selected = false;
				} else {
					this.active = true;
				}
			}
		} else {
			// Focus landed on a child element of current item but let's ensure it gets active:
			this.active = true;
		}
	}

	@HostListener('focus', ['$event'])
	onFocus($event: FocusEvent) {
		this.navigableOnFocus.emit($event);

		if (!$event.defaultPrevented && !this.active) {
			this.active = true;
		}
	}

	public focus() {
		this.element.nativeElement.focus();
	}

	public moveUp() {
		this.navigableOnMove.emit(new ObNavigableOnMoveEvent('ArrowUp'));
	}

	public moveDown() {
		this.navigableOnMove.emit(new ObNavigableOnMoveEvent('ArrowDown'));
	}

	private static hasAncestorClass(element: Element, className: string): boolean {
		while (element && element.parentElement) {
			element = element.parentElement;
			if (element.classList.contains(className)) {
				return true;
			}
		}
		return false;
	}

	private static getAncestorElement(element: Element, nodeName: string): Element {
		while (element && element.parentElement) {
			element = element.parentElement;
			if (element.nodeName.toLowerCase() === nodeName) {
				return element;
			}
		}
		return undefined;
	}

	private static isFocusable(element): boolean {
		const nodeName = element.nodeName.toLowerCase();
		// prettier-ignore
		if (
			!element.offsetHeight
			|| !element.offsetWidth
			|| element.hasAttribute('disabled')
			|| ObNavigableDirective.isWithinDisabledFieldset(element, nodeName)
		) {
			return false;
		}

		return (nodeName === 'a' && element.href) || element.hasAttribute('tabindex');
	}

	private static isWithinDisabledFieldset(element: Element, nodeName: string): boolean {
		if (!/^(input|select|textarea|button|object)$/.test(nodeName)) {
			return false;
		}

		const fieldset = ObNavigableDirective.getAncestorElement(element, 'fieldset');
		return fieldset && fieldset.hasAttribute('disabled');
	}
}
