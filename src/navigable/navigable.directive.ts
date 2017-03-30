import {
	Directive, Input, ElementRef, HostBinding, Output, EventEmitter,
	HostListener, AfterViewInit
} from '@angular/core';

import * as $ from 'jquery';

/**
 * NavigableDirective
 *
 * API:
 * - [navigable]:any                             The data model, that should be selected.
 * - [navigableActivate]:boolean                 Activates current item if `true`.
 * - [navigableHighlight]:boolean                Highlights current item if `true`.
 * - [navigableFocusOnInit]:boolean              Focused current item if `true`, on directive initialisation only.
 * - (navigableOnActivation):void                Emits if item is activated.
 * - (navigableOnChange):NavigableOnChangeEvent  Emits if UP or DOWN key is pressed, while item is focused.
 * - (navigableOnFocus):FocusEvent               Emits if item is focused.
 * - (navigableOnMouseDown):MouseEvent           Emits if item is clicked/tapped.
 * - (navigableOnMove):FocusEvent                Emits if item is moved (with SHIFT+CTRL+[UP|DOWN]).
 */
@Directive({
	selector: '[navigable]',
	exportAs: 'navigable'
})
export class NavigableDirective implements AfterViewInit {

	public static KEYS = {
		UP: 38,
		DOWN: 40
	};

	@Input('navigable') model: any;

	@Input('navigableFocusOnInit')
	focusOnInit: boolean;

	@Output() navigableOnActivation = new EventEmitter();
	@Output() navigableOnChange = new EventEmitter<NavigableOnChangeEvent>();
	@Output() navigableOnFocus = new EventEmitter();
	@Output() navigableOnMouseDown = new EventEmitter();
	@Output() navigableOnMove = new EventEmitter();

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
		if (value) {
			setTimeout(() => {
				this.active = true;
			});
		}
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

	constructor(private element: ElementRef) {
	}

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
		let keyCode = $event.keyCode;

		if (keyCode === NavigableDirective.KEYS.UP || keyCode === NavigableDirective.KEYS.DOWN) {
			let focused = $(this.element.nativeElement).find(':focus');

			if (!focused || !focused.is('.dropdown-toggle') && focused.parents('.dropdown-menu').length === 0) {
				$event.preventDefault();

				if ($event.ctrlKey && $event.shiftKey) {
					this.navigableOnMove.emit(new NavigableOnMoveEvent(keyCode));

					// Try to restore focus:
					setTimeout(() => {
						if (focused.length) {
							focused.focus();
						} else {
							this.focus();
						}
					}, 0);
				} else {
					this.navigableOnChange.emit(new NavigableOnChangeEvent(keyCode, $event.ctrlKey || $event.shiftKey));
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
		if (target === this.element.nativeElement || !this.focusable(target)) {
			if (!$event.defaultPrevented) {
				if ($event && $event.shiftKey) {
					this.active = true;
					$event.preventDefault(); // This prevents text selection as we are holding the SHIFT key...
					this.focus();            // ...but then focus needs to be manually restored.
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
		this.navigableOnMove.emit(new NavigableOnMoveEvent(NavigableDirective.KEYS.UP));
	}

	public moveDown() {
		this.navigableOnMove.emit(new NavigableOnMoveEvent(NavigableDirective.KEYS.DOWN));
	}

	/**
	 * From jQuery UI: https://github.com/jquery/jquery-ui/blob/master/ui/focusable.js#L28
	 *
	 * FIXME: cleanup & remove this!
	 *
	 * @param element
	 * @returns {*}
	 */
	private focusable(element) {
		let map, mapName, img, focusableIfVisible, fieldset,
			nodeName = element.nodeName.toLowerCase();
		if (nodeName === 'area') {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
				return false;
			}
			img = $('img[usemap=\'#' + mapName + '\']');
			return img.length > 0 && img.is(':visible');
		}

		if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
			focusableIfVisible = !element.disabled;

			if (focusableIfVisible) {
				// Form controls within a disabled fieldset are disabled.
				// However, controls within the fieldset's legend do not get disabled.
				// Since controls generally aren't placed inside legends, we skip
				// this portion of the check.
				fieldset = $(element).closest('fieldset')[0];
				if (fieldset) {
					focusableIfVisible = !fieldset.disabled;
				}
			}
		} else if ('a' === nodeName) {
			focusableIfVisible = element.href || $(element).attr('tabindex');
		} else {
			focusableIfVisible = $(element).attr('tabindex');
		}

		return focusableIfVisible && $(element).is(':visible') && this.visible($(element));
	}

	// Support: IE 8 only
	// IE 8 doesn't resolve inherit to visible/hidden for computed values
	private visible(element) {
		let visibility = element.css('visibility');
		while (visibility === 'inherit') {
			element = element.parent();
			visibility = element.css('visibility');
		}
		return visibility !== 'hidden';
	}
}


export class PreventableEvent {
	public prevented = false;
}

export class NavigableOnChangeEvent extends PreventableEvent {
	constructor(public keyCode: number, public combine: boolean) {
		super();
	}
}

export class NavigableOnMoveEvent extends PreventableEvent {
	constructor(public keyCode: number) {
		super();
	}
}

