import {
	AfterViewInit, Directive, ElementRef, Inject, Input, Renderer2
} from '@angular/core';
import 'rxjs/add/operator/throttleTime';
import {Subject} from 'rxjs/Subject';
import {NavTreeComponent} from './nav-tree.component';
import {DOCUMENT} from '@angular/common';

export class RootDocument extends Document {
	public fakeFocusCssInitialized: boolean;
}

export class FakeFocusOptionsTrigger {
	constructor(
		public name: string,
		public customDebounceTime: number = -1,
	) {}
}

export class FakeFocusOptionsTriggers {
	public focusNext: FakeFocusOptionsTrigger[];
	public focusPrevious: FakeFocusOptionsTrigger[];
	public accept: FakeFocusOptionsTrigger[];
	public blur: FakeFocusOptionsTrigger[];
	public toggleCollapsed: FakeFocusOptionsTrigger[];
	public defaultDebounceTime: number;
}

export class FakeFocusOptions {
	public triggers: FakeFocusOptionsTriggers;
}

/**
 * Directive to be used on the or-nav-tree component in order to get a "fake focus" keyboard navigation.
 * Usage:
 * <or-nav-tree
 * 		...
 * 		[orNavTreeFakeFocus]="inputElement"
 * 		[orNavTreeFakeFocusOptions]="{}"
 * 		...
 * ></or-nav-treee>
 *
 */
@Directive({
	selector: '[orNavTreeFakeFocus]',
})
export class NavTreeFakeFocusDirective implements AfterViewInit {

	private static readonly FakeFocusClass = 'fake-focus';

	private static readonly FocusStyleSelectorPattern: RegExp = new RegExp('(\\.nav-link[\\.\\w]*):(focus)', 'g');

	private static readonly FocusStyleSelectorReplacement: string = '$1.fake-$2';

	private static readonly ItemWrapperSelector = 'ul.nav.nav-tree.expanded > li.nav-item:not(.nav-header)';

	private static readonly ItemContentSelector = 'a';

	@Input()
	options: FakeFocusOptions;

	private inputElement: ElementRef;

	private focusedElement: ElementRef;

	private defaultOptions: FakeFocusOptions = <FakeFocusOptions> {
		triggers: {
			focusNext: [new FakeFocusOptionsTrigger('keydown.ArrowDown')],
			focusPrevious: [new FakeFocusOptionsTrigger('keydown.ArrowUp')],
			accept: [new FakeFocusOptionsTrigger('keydown.Enter', 0)],
			blur: [new FakeFocusOptionsTrigger('focusout')],
			toggleCollapsed: [
				new FakeFocusOptionsTrigger('keydown.ArrowLeft'),
				new FakeFocusOptionsTrigger('keydown.ArrowRight'),
			],
			defaultDebounceTime: 10,
		},
	};

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
	}

	@Input('orNavTreeFakeFocus')
	public set focusInputElement(element: any) {
		if (element instanceof ElementRef) {
			element = element.nativeElement;
		}
		if (!element || !element.tagName) {
			throw new Error(
				'The given value for [orNavTreeFakeFocus] is invalid. ' +
				'It must be a valid native DOM element or ElementRef.'
			);
		}
		this.inputElement = new ElementRef(element);
	}

	public ngAfterViewInit() {
		this.options = Object.assign(this.defaultOptions, this.options || {});
		this.setupEventListeners(this.options.triggers.focusNext, () => this.focusNext());
		this.setupEventListeners(this.options.triggers.focusPrevious, () => this.focusPrevious());
		this.setupEventListeners(this.options.triggers.toggleCollapsed, () => this.toggleCollapsed());
		this.setupEventListeners(this.options.triggers.accept, () => this.accept());
		this.setupEventListeners(this.options.triggers.blur, () => this.blur());
		this.setupFakeFocus();
	}

	private setupFakeFocus() {
		this.inputElement.nativeElement.setAttribute('autocomplete', 'off');
		if (this.document.fakeFocusCssInitialized) {
			return;
		}
		// see also: https://github.com/justb81/jsFakePseudoClasses/blob/master/src/fake-pseudo-classes.js
		for (let styleSheetIndex = 0; styleSheetIndex < this.document.styleSheets.length; styleSheetIndex++) {
			let styleSheet: any = this.document.styleSheets[styleSheetIndex];
			for (let ruleIndex = 0; styleSheet.cssRules && ruleIndex < styleSheet.cssRules.length; ruleIndex++) {
				let rule = styleSheet.cssRules[ruleIndex];
				if (NavTreeFakeFocusDirective.FocusStyleSelectorPattern.exec(rule.selectorText)) {
					let changedSelector = rule.selectorText.replace(
						NavTreeFakeFocusDirective.FocusStyleSelectorPattern,
						NavTreeFakeFocusDirective.FocusStyleSelectorReplacement
					);
					styleSheet.insertRule(`${changedSelector}{${rule.style.cssText}}`, styleSheet.cssRules.length);
				}
			}
		}
		this.document.fakeFocusCssInitialized = true;
	}

	private setupEventListeners(triggers: FakeFocusOptionsTrigger[], callback: () => void) {
		triggers.forEach((trigger) => {
			let debouncer: Subject<any> = new Subject<any>();
			debouncer.throttleTime(trigger.customDebounceTime || this.options.triggers.defaultDebounceTime)
				.subscribe(callback);
			this.renderer.listen(this.inputElement.nativeElement, trigger.name, () => debouncer.next());
		});
	}

	private toggleCollapsed() {
		if (this.focusedElement) {
			// @todo: try new CustomEvent(bla)
			let event = this.document.createEvent('Event'); // Some browsers (IE) don't support new Event()
			event.initEvent(NavTreeComponent.EVENT_TOGGLE_COLLAPSED, false, true);
			this.focusedElement.nativeElement.dispatchEvent(event);
		}
	}

	private focusNext() {
		if (
			!this.tryFocusFirstDescendant()
			&& !this.tryFocusNextSibling()
			&& !this.tryFocusParentSibling()
		) {
			this.focusFirst();
		}
	}

	private focusPrevious() {
		if (
			!this.tryFocusPreviousSiblingChild()
			&& !this.tryFocusPreviousSibling()
			&& !this.tryFocusParent()
		) {
			this.focusLast();
		}
	}

	private focusFirst() {
		let nativeElement = this.element.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemWrapperSelector);
		if (nativeElement) {
			this.tryFocus(new ElementRef(nativeElement));
		}
	}

	private focusLast() {
		let context = this.element.nativeElement;
		while (context && context.lastElementChild ) {
			context = context.lastElementChild;
		}
		this.tryFocus(this.findClosest(new ElementRef(context)));
	}

	private accept() {
		if (this.focusedElement) {
			this.focusedElement.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemContentSelector).click();
		}
	}

	private blur() {
		if (this.focusedElement) {
			this.renderer.removeClass(
				this.focusedElement.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemContentSelector),
				NavTreeFakeFocusDirective.FakeFocusClass
			);
		}
	}

	private tryFocusFirstDescendant(): boolean {
		if (!this.focusedElement) {
			return false;
		}
		let nativeElement = this.focusedElement.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemWrapperSelector);
		if (nativeElement) {
			return this.tryFocus(new ElementRef(nativeElement));
		}
		return false;
	}

	private tryFocusNextSibling(parent: ElementRef = null): boolean {
		parent = parent || this.focusedElement;
		if (!parent) {
			return false;
		}
		let sibling = parent.nativeElement.nextElementSibling;
		while (sibling && !this.matches(sibling)) {
			sibling = sibling.nextElementSibling;
		}
		if (!sibling) {
			return false;
		}
		return this.tryFocus(new ElementRef(sibling));
	}

	private tryFocusParentSibling(): boolean {
		if (!this.focusedElement) {
			return false;
		}
		let context = this.focusedElement.nativeElement.parentElement;
		while (context && !this.tryFocusNextSibling(new ElementRef(context))) {
			context = context.parentElement;
		}
		return !!context;
	}

	private tryFocus(element: ElementRef): boolean {
		if (!element || !this.element.nativeElement.contains(element.nativeElement)) {
			return false;
		}
		this.blur();
		this.renderer.addClass(
			element.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemContentSelector),
			NavTreeFakeFocusDirective.FakeFocusClass
		);
		this.focusedElement = element;
		this.scrollIntoView();
		return true;
	}

	private tryFocusPreviousSibling(parent: ElementRef = null): boolean {
		parent = parent || this.focusedElement;
		if (!parent) {
			return false;
		}
		let sibling = parent.nativeElement.previousElementSibling;
		while (sibling && !this.matches(sibling)) {
			sibling = sibling.previousElementSibling;
		}
		if (!sibling) {
			return false;
		}
		return this.tryFocus(new ElementRef(sibling));
	}

	private tryFocusParent(): boolean {
		if (!this.focusedElement || !this.focusedElement.nativeElement.parentElement) {
			return false;
		}
		return this.tryFocus(this.findClosest(new ElementRef(this.focusedElement.nativeElement.parentElement)));
	}

	private tryFocusPreviousSiblingChild(): boolean {
		if (!this.focusedElement) {
			return false;
		}
		let context = this.focusedElement.nativeElement.previousElementSibling;
		while (context && context.lastElementChild ) {
			context = context.lastElementChild;
		}
		return this.tryFocus(this.findClosest(new ElementRef(context)));
	}

	private findClosest(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement) {
			return null;
		}
		let parent = element.nativeElement.parentElement;
		while (parent && !this.matches(parent)) {
			parent = parent.parentElement;
		}
		return new ElementRef(parent);
	}

	private matches(element): boolean {
		return element.msMatchesSelector ?
			element.msMatchesSelector(NavTreeFakeFocusDirective.ItemWrapperSelector)
			: element.matches(NavTreeFakeFocusDirective.ItemWrapperSelector);
	}

	private scrollIntoView() {
		let element = this.focusedElement.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemContentSelector);
		if (element) {
			element.scrollIntoView({behavior: 'auto', inline: 'center'});
		}
	}
}
