import {
	AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, Renderer2
} from '@angular/core';
import 'rxjs/add/operator/throttleTime';
import {Subject} from 'rxjs/Subject';
import {DOCUMENT} from '@angular/common';

export class RootDocument extends Document {
	public fakeFocusCssInitialized: boolean;
}

export class FakeFocusTrigger {
	constructor(
		public name: string,
		public customDebounceTime: number = -1,
	) {}
}

interface FakeFocusTriggers {
	focusNext: FakeFocusTrigger[];
	focusPrevious: FakeFocusTrigger[];
	accept: FakeFocusTrigger[];
	blur: FakeFocusTrigger[];
	toggleCollapsed: FakeFocusTrigger[];
	defaultDebounceTime: number;
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

	public static EVENT_TOGGLE_COLLAPSED = 'or.navTree.item.toggleCollapsed';

	private static readonly ItemWrapperSelector = 'ul.nav.nav-tree.expanded:not(.disabled) > li.nav-item:not(.nav-header):not(.disabled)';

	private static readonly ItemContentSelector = 'a';

	private static readonly FakeFocusClass = 'fake-focus';

	private static readonly FocusStyleSelectorPattern: RegExp = new RegExp('(\\.nav-link[\\.\\w]*):(focus)', 'g');

	private static readonly FocusStyleSelectorReplacement: string = '$1.fake-$2';

	private static readonly Triggers: FakeFocusTriggers = {
		focusNext: [new FakeFocusTrigger('keydown.ArrowDown')],
		focusPrevious: [new FakeFocusTrigger('keydown.ArrowUp')],
		accept: [new FakeFocusTrigger('keydown.Enter', 0)],
		blur: [new FakeFocusTrigger('blur')],
		toggleCollapsed: [
			new FakeFocusTrigger('keydown.ArrowLeft'),
			new FakeFocusTrigger('keydown.ArrowRight'),
		],
		defaultDebounceTime: 10,
	};

	private static readonly ScrollOptions: ScrollIntoViewOptions = {behavior: 'auto', inline: 'center'};

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
		this.blur();
		this.renderer.addClass(link.nativeElement, NavTreeFakeFocusDirective.FakeFocusClass);
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
		this.eventSubscriptions = [];
		this.setupEventListeners(NavTreeFakeFocusDirective.Triggers.focusNext, () => this.focusNext());
		this.setupEventListeners(NavTreeFakeFocusDirective.Triggers.focusPrevious, () => this.focusPrevious());
		this.setupEventListeners(NavTreeFakeFocusDirective.Triggers.toggleCollapsed, () => this.toggleCollapsed());
		this.setupEventListeners(NavTreeFakeFocusDirective.Triggers.accept, () => this.accept());
		this.setupEventListeners(NavTreeFakeFocusDirective.Triggers.blur, () => this.blur());
	}

	private setupEventListeners(triggers: FakeFocusTrigger[], callback: () => void) {
		if (!triggers) {
			return;
		}
		triggers.forEach((trigger) => {
			let debouncer: Subject<any> = new Subject<any>();
			debouncer.throttleTime(trigger.customDebounceTime || NavTreeFakeFocusDirective.Triggers.defaultDebounceTime)
				.subscribe(callback);
			this.eventSubscriptions.push(this.renderer.listen(
				this.inputElement.nativeElement,
				trigger.name,
				() => debouncer.next()
			));
		});
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

	private blur() {
		let link = this.findLink();
		if (link && link.nativeElement) {
			this.renderer.removeClass(link.nativeElement, NavTreeFakeFocusDirective.FakeFocusClass);
		}
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
		let link = element.nativeElement.querySelector(NavTreeFakeFocusDirective.ItemContentSelector);
		return link ? new ElementRef(link) : null;
	}

	private extractAllListElements(): any[] {
		return [].slice.call(this.element.nativeElement.querySelectorAll(NavTreeFakeFocusDirective.ItemWrapperSelector));
	}

	private ensureInView(): void {
		let link = this.findLink();
		if (link && link.nativeElement) {
			link.nativeElement.scrollIntoView(NavTreeFakeFocusDirective.ScrollOptions);
		}
	}
}
