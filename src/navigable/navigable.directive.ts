import {
	Directive, Input, ElementRef, HostBinding, Output, EventEmitter,
	HostListener, AfterViewInit
} from '@angular/core';

import * as $ from 'jquery'

/**
 * NavigableDirective
 *
 * API:
 * - [navigable]:any                             The data model, that should be selected.
 * - [navigableActivate]:boolean                 Activates current item if `true`.
 * - [navigableFocusOnInit]:boolean              Focused current item if `true`, on directive initialisation only.
 * - [navigableHighlight]:boolean                Highlights current item if `true`.
 * - (navigableOnChange):NavigableOnChangeEvent  Emits if UP or DOWN key is pressed, while item is focused.
 * - (navigableOnMouseDown):MouseEvent           Emits if item is clicked/tapped.
 * - (navigableOnFocus):FocusEvent               Emits if item is focused.
 * - (navigableOnActivation):void                Emits if item is activated.
 * - (navigableOnFocus):FocusEvent               Emits if item is moved (with SHIFT+CTRL+[UP|DOWN]).
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

	@Input('navigable') model:any;

	@Output() navigableOnChange = new EventEmitter();
	@Output() navigableOnMouseDown = new EventEmitter();
	@Output() navigableOnFocus = new EventEmitter();
	@Output() navigableOnMove = new EventEmitter();
	@Output() navigableOnActivation = new EventEmitter();

	@HostBinding('tabindex')
	tabindex = 0;

	@HostBinding('class.navigable')
	navigableClass = true;

	@HostBinding('class.navigable-selected')
	selected = false;

	@Input()
	@HostBinding('class.navigable-highlight')
	navigableHighlight:boolean = false;

	@HostBinding('class.navigable-active')
	@Input('navigableActivate')
	get activate() {
		return this.activated;
	}
	set activate(val:boolean) {
		this.activated = val;
		if (val) {
			this.navigableOnActivation.emit();
		}
	}
	private activated = false;

	@Input('navigableFocusOnInit') focusOnInit:boolean;

	constructor(private element: ElementRef) {
	}

	ngAfterViewInit(): void {
		// This makes sure, that parent components are able to subscribe to the navigableOnFocus before onFocus is triggered
		setTimeout(() => {
			if (this.focusOnInit) {
				this.focus();
			}
		}, 0);
	}

	//TODO: discuss if this should completely moved to parent
	@HostListener('keydown', ['$event']) onKeyDown($event: KeyboardEvent) {
		let keyCode = $event.keyCode;
		if (keyCode === NavigableDirective.KEYS.UP || keyCode === NavigableDirective.KEYS.DOWN) {
			let focused = $(this.element.nativeElement).find(':focus');

			if (!focused || !focused.is('.dropdown-toggle') && focused.parents('.dropdown-menu').length === 0) {
				$event.preventDefault();

				if ($event.ctrlKey && $event.shiftKey) {
					this.navigableOnMove.emit(new NavigableOnMoveEvent(keyCode));

					// Try to restore focus:
					setTimeout(() => {
						if(focused.length) {
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

	@HostListener('mousedown', ['$event']) onMouseDown($event: MouseEvent) {
		if (!this.focusable($event.target)) {
			this.navigableOnMouseDown.emit($event);
		} else {
			// Focus is on a child element of current item but let's ensure it gets activated:
			this.activate = true;
		}
	}

	@HostListener('focus', ['$event']) onFocus($event: FocusEvent) {
		this.navigableOnFocus.emit($event);
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
	 * @param element
	 * @returns {*}
	 */
	private focusable(element) {
		let map, mapName, img, focusableIfVisible, fieldset,
			nodeName = element.nodeName.toLowerCase();
		if (nodeName === "area") {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
				return false;
			}
			img = $("img[usemap='#" + mapName + "']");
			return img.length > 0 && img.is(":visible");
		}

		if(/^(input|select|textarea|button|object)$/.test(nodeName)) {
			focusableIfVisible = !element.disabled;

			if(focusableIfVisible) {
				// Form controls within a disabled fieldset are disabled.
				// However, controls within the fieldset's legend do not get disabled.
				// Since controls generally aren't placed inside legends, we skip
				// this portion of the check.
				fieldset = $(element).closest("fieldset")[0];
				if ( fieldset ) {
					focusableIfVisible = !fieldset.disabled;
				}
			}
		} else if ( "a" === nodeName ) {
			focusableIfVisible = element.href || $(element).attr('tabindex');
		} else {
			focusableIfVisible = $(element).attr('tabindex');
		}

		return focusableIfVisible && $(element).is(":visible") && this.visible($(element));
	}

	// Support: IE 8 only
	// IE 8 doesn't resolve inherit to visible/hidden for computed values
	private visible(element) {
		let visibility = element.css("visibility");
		while (visibility === "inherit") {
			element = element.parent();
			visibility = element.css("visibility");
		}
		return visibility !== "hidden";
	}
}

export class NavigableOnChangeEvent {
	constructor(public keyCode: number, public combine: boolean) {
	}
}

export class NavigableOnMoveEvent {
	public prevented:boolean = false;
	constructor(public keyCode: number) {
	}
}
