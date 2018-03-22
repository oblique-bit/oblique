import {
	Directive, ElementRef, Input, OnDestroy, Renderer2
} from '@angular/core';
import 'rxjs/add/operator/throttleTime';
import {Subject} from 'rxjs/Subject';

/**
 * Directive to be used on the `or-nav-tree` component in order to get a "fake focus" keyboard navigation.
 *
 * Usage:
 * <or-nav-tree
 * 		...
 * 		[orNavTreeFakeFocus]="elementRef"
 * 		...
 * ></or-nav-tree>
 */
@Directive({
	selector: '[orNavTreeFakeFocus]',
})
export class NavTreeFakeFocusDirective implements OnDestroy {

	public static readonly EVENT_TOGGLE_COLLAPSED = 'or.navTree.item.toggleCollapsed';

	public static readonly KEY_DOWN_DEBOUNCE_MILLIS = 10;

	public static readonly KEYS = {
		UP: 'ArrowUp',
		DOWN: 'ArrowDown',
		LEFT: 'ArrowLeft',
		RIGHT: 'ArrowRight',
		ENTER: 'Enter',
	};

	public static readonly INPUT_EVENTS = {
		KEY_DOWN: 'keydown',
		BLUR: 'blur',
	};

	public static readonly CSS_CLASSES = {
		LINK_ACTIVE: 'active',
		FAKE_FOCUS: 'nav-tree-fake-focus',
	};

	public static readonly CSS_SELECTORS = {
		LINK_ACTIVE: `.${NavTreeFakeFocusDirective.CSS_CLASSES.LINK_ACTIVE}`,
		FAKE_FOCUS: `.${NavTreeFakeFocusDirective.CSS_CLASSES.FAKE_FOCUS}`,
		ITEM_LINK: '.nav-link',
		ITEM_WRAPPER: '.nav-tree.expanded:not(.disabled) > .nav-item:not(.nav-header):not(.disabled)'
	};

	private static readonly SCROLL_OPTIONS: ScrollIntoViewOptions = {behavior: 'auto', inline: 'center'};

	private readonly keyHandlers: object = {};

	private inputElement: ElementRef;

	private focusedElement: ElementRef;

	private eventSubscriptions: (() => void)[] = [];

	public constructor(
		private readonly element: ElementRef,
		private readonly renderer: Renderer2
	) {
		if (this.element.nativeElement.localName !== 'or-nav-tree') {
			throw new Error(
				'Directive nav-tree-selector can only be used on or-nav-tree elements. '
				+ `Current element is: '${this.element.nativeElement.localName}'`
			);
		}
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.DOWN] = () => this.focusNext();
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.UP] = (event) => this.focusPrevious(event);
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.ENTER] = () => this.accept();
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.LEFT] = () => this.toggleCollapsed();
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.RIGHT] = () => this.toggleCollapsed();
	}

	@Input('orNavTreeFakeFocus')
	public set focusInputElement(element: any) {
		if (element && !(element instanceof ElementRef)) {
			element = new ElementRef(element);
		}
		this.inputElement = element;
		this.initInputElement();
	}

	public ngOnDestroy() {
		this.unsubscribeInputListeners();
	}

	public fakeFocus(element: ElementRef): void {
		console.log(element);
		let link = this.findLink(element);
		if (!link || !this.element.nativeElement.contains(link.nativeElement)) {
			throw new Error(`Unable to fake focus element '${element}'. No valid DOM element or no valid child.`);
		}
		this.onBlur();

		// Ensure we don't apply the fake focus on a pre-activated link:
		if(!link.nativeElement.classList.contains(NavTreeFakeFocusDirective.CSS_CLASSES.LINK_ACTIVE)) {
			this.renderer.addClass(link.nativeElement, NavTreeFakeFocusDirective.CSS_CLASSES.LINK_ACTIVE);
			this.renderer.addClass(link.nativeElement, NavTreeFakeFocusDirective.CSS_CLASSES.FAKE_FOCUS);
		}

		this.focusedElement = element;
		this.ensureInView();
	}

	private initInputElement() {
		this.unsubscribeInputListeners();
		if (!this.inputElement) {
			return;
		}
		if (!this.inputElement.nativeElement || !this.inputElement.nativeElement.tagName) {
			throw new Error(
				'The given value for [orNavTreeFakeFocus] is invalid. ' +
				'It must be a valid native DOM element or ElementRef.'
			);
		}
		this.unsubscribeInputListeners();
		this.inputElement.nativeElement.setAttribute('autocomplete', 'off');
		this.initEventListeners();
	}

	private initEventListeners() {
		let debouncer: Subject<any> = new Subject<any>();
		debouncer.throttleTime(NavTreeFakeFocusDirective.KEY_DOWN_DEBOUNCE_MILLIS).subscribe(
			(event) => this.onKeyDown(event)
		);
		this.eventSubscriptions.push(this.renderer.listen(
			this.inputElement.nativeElement,
			NavTreeFakeFocusDirective.INPUT_EVENTS.KEY_DOWN,
			(event) => debouncer.next(event)
		));
		this.eventSubscriptions.push(this.renderer.listen(
			this.inputElement.nativeElement,
			NavTreeFakeFocusDirective.INPUT_EVENTS.BLUR,
			() => this.onBlur(true)
		));
	}

	private onKeyDown(event: KeyboardEvent) {
		if (this.keyHandlers.hasOwnProperty(event.key)) {
			this.keyHandlers[event.key](event);
		}
	}

	private onBlur(reset = false) {
		if (this.focusedElement) {
			let link = this.findLink(this.focusedElement);

			// Ensure we don't remove the active state from non-"fake-focus" links:
			if(link.nativeElement.classList.contains(NavTreeFakeFocusDirective.CSS_CLASSES.FAKE_FOCUS)) {
				this.renderer.removeClass(link.nativeElement, NavTreeFakeFocusDirective.CSS_CLASSES.LINK_ACTIVE);
				this.renderer.removeClass(link.nativeElement, NavTreeFakeFocusDirective.CSS_CLASSES.FAKE_FOCUS);
			}

			if(reset) {
				this.focusedElement = null;
			}
		}
	}

	private unsubscribeInputListeners() {
		this.eventSubscriptions.forEach((unsubscribe: () => void) => unsubscribe());
		this.eventSubscriptions = [];
	}

	private accept() {
		let link = this.findLink();
		if (link && link.nativeElement) {
			link.nativeElement.click();
		}
	}

	private toggleCollapsed(): void {
		if (!this.focusedElement || !this.focusedElement.nativeElement) {
			return;
		}
		let event;
		if (CustomEvent && typeof CustomEvent === 'function') {
			event = new CustomEvent(NavTreeFakeFocusDirective.EVENT_TOGGLE_COLLAPSED);
		} else { // Some browsers (IE) don't support Event constructors
			event = document.createEvent('Event');
			event.initEvent(NavTreeFakeFocusDirective.EVENT_TOGGLE_COLLAPSED, false, true);
		}
		this.focusedElement.nativeElement.dispatchEvent(event);
	}

	private focusNext() {
		let elements = this.extractAllListElements();
		let nextIndex = 0;
		if (this.focusedElement) {
			nextIndex = elements.indexOf(this.focusedElement.nativeElement) + 1;
		}
		this.fakeFocus(new ElementRef(elements[nextIndex < elements.length ? nextIndex : 0]));
	}

	private focusPrevious(event: Event) {
		// Ensure cursor does not move back in the text field:
		event.preventDefault();

		let elements = this.extractAllListElements();
		let previousIndex = -1;
		if (this.focusedElement) {
			previousIndex = elements.indexOf(this.focusedElement.nativeElement) - 1;
		}
		this.fakeFocus(new ElementRef(elements[previousIndex >= 0 ? previousIndex : elements.length - 1]));
	}

	private findLink(element: ElementRef = null): ElementRef {
		element = element || this.focusedElement;
		if (!element || !element.nativeElement) {
			return null;
		}
		let link = element.nativeElement.querySelector(NavTreeFakeFocusDirective.CSS_SELECTORS.ITEM_LINK);
		return link ? new ElementRef(link) : null;
	}

	private extractAllListElements(): any[] {
		return [].slice.call(this.element.nativeElement.querySelectorAll(NavTreeFakeFocusDirective.CSS_SELECTORS.ITEM_WRAPPER));
	}

	private ensureInView(): void {
		let link = this.findLink();
		if (link && link.nativeElement) {
			link.nativeElement.scrollIntoView(NavTreeFakeFocusDirective.SCROLL_OPTIONS);
		}
	}
}
