import {
	AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, Renderer2
} from '@angular/core';
import 'rxjs/add/operator/throttleTime';
import {Subject} from 'rxjs/Subject';
import {DOCUMENT} from '@angular/common';

export class RootDocument extends Document {
	public fakeFocusCssInitialized: boolean;
}

/**
 * Directive to be used on the or-nav-tree component in order to get a "fake focus" keyboard navigation.
 * Usage:
 * <or-nav-tree
 * 		...
 * 		[orNavTreeFakeFocus]="inputElement"
 * 		...
 * ></or-nav-tree>
 */
@Directive({
	selector: '[orNavTreeFakeFocus]',
})
export class NavTreeFakeFocusDirective implements AfterViewInit, OnDestroy {

	public static readonly EVENT_TOGGLE_COLLAPSED = 'or.navTree.item.toggleCollapsed';

	public static readonly KEYS = {
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		ENTER: 13,
	};

	private static readonly INPUT_EVENTS = {
		KEY_DOWN: 'keydown',
		BLUR: 'blur',
	};

	private static readonly ITEM_WRAPPER_SELECTOR = 'ul.nav.nav-tree.expanded:not(.disabled) > li.nav-item:not(.nav-header):not(.disabled)';

	private static readonly ITEM_LINK_SELECTOR = '.nav-link';

	private static readonly FAKE_FOCUS_CLASS = 'fake-focus';

	private static readonly FOCUS_STYLE = {
		SELECTOR_PATTERN: new RegExp('(\\.nav-link[\\.\\w]*):(focus)', 'g'),
		SELECTOR_REPLACEMENT: '$1.fake-$2',
	};

	private static readonly KEY_DOWN_DEBOUNCE_MILLIS = 10;

	private static readonly SCROLL_OPTIONS: ScrollIntoViewOptions = {behavior: 'auto', inline: 'center'};

	private readonly keyHandlers: object = {};

	private inputElement: ElementRef;

	private focusedElement: ElementRef;

	private eventSubscriptions: (() => void)[] = [];

	public constructor(
		private readonly element: ElementRef,
		private readonly renderer: Renderer2,
		@Inject(DOCUMENT) private readonly document: RootDocument,
	) {
		if (this.element.nativeElement.localName !== 'or-nav-tree') {
			throw new Error(
				'Directive nav-tree-selector can only be used on or-nav-tree elements. '
				+ `Current element is: '${this.element.nativeElement.localName}'`
			);
		}
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.DOWN] = () => this.focusNext();
		this.keyHandlers[NavTreeFakeFocusDirective.KEYS.UP] = () => this.focusPrevious();
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

	public ngAfterViewInit() {
		this.setupFakeFocus();
	}

	public ngOnDestroy() {
		this.unsubsribeInputListeners();
	}

	public fakeFocus(element: ElementRef): void {
		let link = this.findLink(element);
		if (!link || !this.element.nativeElement.contains(link.nativeElement)) {
			throw new Error(`Unable to fake focus element '${element}'. No valid DOM element or no valid child.`);
		}
		this.onBlur();
		this.renderer.addClass(link.nativeElement, NavTreeFakeFocusDirective.FAKE_FOCUS_CLASS);
		this.focusedElement = element;
		this.ensureInView();
	}

	private setupFakeFocus() {
		if (this.document.fakeFocusCssInitialized) {
			return;
		}
		// see also: https://github.com/justb81/jsFakePseudoClasses/blob/master/src/fake-pseudo-classes.js
		for (let styleSheetIndex = 0; styleSheetIndex < this.document.styleSheets.length; styleSheetIndex++) {
			let styleSheet: any = this.document.styleSheets[styleSheetIndex];
			for (let ruleIndex = 0; styleSheet.cssRules && ruleIndex < styleSheet.cssRules.length; ruleIndex++) {
				let rule = styleSheet.cssRules[ruleIndex];
				if (NavTreeFakeFocusDirective.FOCUS_STYLE.SELECTOR_PATTERN.exec(rule.selectorText)) {
					let changedSelector = rule.selectorText.replace(
						NavTreeFakeFocusDirective.FOCUS_STYLE.SELECTOR_PATTERN,
						NavTreeFakeFocusDirective.FOCUS_STYLE.SELECTOR_REPLACEMENT
					);
					styleSheet.insertRule(`${changedSelector}{${rule.style.cssText}}`, styleSheet.cssRules.length);
				}
			}
		}
		this.document.fakeFocusCssInitialized = true;
	}

	private initInputElement() {
		this.unsubsribeInputListeners();
		if (!this.inputElement) {
			return;
		}
		if (!this.inputElement.nativeElement || !this.inputElement.nativeElement.tagName) {
			throw new Error(
				'The given value for [orNavTreeFakeFocus] is invalid. ' +
				'It must be a valid native DOM element or ElementRef.'
			);
		}
		this.unsubsribeInputListeners();
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
			() => this.onBlur()
		));
	}

	private onKeyDown(event: KeyboardEvent) {
		if (this.keyHandlers.hasOwnProperty(event.keyCode)) {
			this.keyHandlers[event.keyCode]();
		}
	}

	private onBlur() {
		let link = this.findLink();
		if (link && link.nativeElement) {
			this.renderer.removeClass(link.nativeElement, NavTreeFakeFocusDirective.FAKE_FOCUS_CLASS);
		}
	}

	private unsubsribeInputListeners() {
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

	private focusPrevious() {
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
		let link = element.nativeElement.querySelector(NavTreeFakeFocusDirective.ITEM_LINK_SELECTOR);
		return link ? new ElementRef(link) : null;
	}

	private extractAllListElements(): any[] {
		return [].slice.call(this.element.nativeElement.querySelectorAll(NavTreeFakeFocusDirective.ITEM_WRAPPER_SELECTOR));
	}

	private ensureInView(): void {
		let link = this.findLink();
		if (link && link.nativeElement) {
			link.nativeElement.scrollIntoView(NavTreeFakeFocusDirective.SCROLL_OPTIONS);
		}
	}
}
