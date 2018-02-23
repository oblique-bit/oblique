import {
	AfterViewInit, Directive, ElementRef, Inject, Input, Renderer2
} from '@angular/core';
import 'rxjs/add/operator/throttleTime';
import {Subject} from 'rxjs/Subject';
import {DOCUMENT} from '@angular/common';
import {NavTreeDomUtil} from './nav-tree-dom.util';

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

	@Input('orNavTreeFakeFocusOptions')
	options: FakeFocusOptions;

	private inputElement: ElementRef;

	private focusedElement: ElementRef;

	private defaultOptions: FakeFocusOptions = <FakeFocusOptions> {
		triggers: {
			focusNext: [new FakeFocusOptionsTrigger('keydown.ArrowDown')],
			focusPrevious: [new FakeFocusOptionsTrigger('keydown.ArrowUp')],
			accept: [new FakeFocusOptionsTrigger('keydown.Enter', 0)],
			blur: [new FakeFocusOptionsTrigger('blur')],
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

	public fakeFocus(element: ElementRef) {
		if (!this.tryFocus(element)) {
			throw new Error(`Unable to fake focus element '${element}'. No valid DOM element or no valid child.`);
		}
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

	private accept() {
		NavTreeDomUtil.triggerClick(this.focusedElement);
	}

	private toggleCollapsed() {
		NavTreeDomUtil.triggerToggleCollapsed(this.focusedElement);
	}

	private blur() {
		let link = NavTreeDomUtil.findLink(this.focusedElement);
		if (link && link.nativeElement) {
			this.renderer.removeClass(link.nativeElement, NavTreeFakeFocusDirective.FakeFocusClass);
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

	private tryFocusFirstDescendant(element: ElementRef = null): boolean {
		let descendant = NavTreeDomUtil.findFirstDescendant(element || this.focusedElement);
		return descendant ? this.tryFocus(descendant) : false;
	}

	private tryFocusNextSibling(element: ElementRef = null): boolean {
		let sibling = NavTreeDomUtil.findNextSibling(element || this.focusedElement);
		return sibling ? this.tryFocus(sibling) : false;
	}

	private tryFocusParentSibling(element: ElementRef = null): boolean {
		let parent = NavTreeDomUtil.findClosest(element || this.focusedElement);
		while (parent && !this.tryFocusNextSibling(parent)) {
			parent = NavTreeDomUtil.findClosest(parent);
		}
		return !!parent;
	}

	private focusFirst() {
		this.tryFocusFirstDescendant(this.element);
	}

	private focusPrevious() {
		if (
			!this.tryFocusPreviousSiblingLastDescendant()
			&& !this.tryFocusPreviousSibling()
			&& !this.tryFocusParent()
		) {
			this.focusLast();
		}
	}

	private tryFocusPreviousSiblingLastDescendant(element: ElementRef = null): boolean {
		let sibling = NavTreeDomUtil.findPreviousSibling(element || this.focusedElement);
		return sibling ? this.tryFocusLastDescendant(sibling) : false;
	}

	private tryFocusLastDescendant(element: ElementRef): boolean {
		let siblingDescendant = NavTreeDomUtil.findLastDescendant(element || this.focusedElement);
		return siblingDescendant ? this.tryFocus(siblingDescendant) : false;
	}

	private tryFocusPreviousSibling(element: ElementRef = null): boolean {
		let sibling = NavTreeDomUtil.findPreviousSibling(element || this.focusedElement);
		return sibling ? this.tryFocus(sibling) : false;
	}

	private tryFocusParent(element: ElementRef = null): boolean {
		let parent = NavTreeDomUtil.findClosest(element || this.focusedElement);
		return parent ? this.tryFocus(parent) : false;
	}

	private focusLast() {
		this.tryFocusLastDescendant(this.element);
	}

	private tryFocus(element: ElementRef): boolean {
		let link = NavTreeDomUtil.findLink(element);
		if (!NavTreeDomUtil.contains(this.element, link)) {
			return false;
		}
		this.blur();
		this.renderer.addClass(link.nativeElement, NavTreeFakeFocusDirective.FakeFocusClass);
		this.focusedElement = element;
		NavTreeDomUtil.ensureInView(this.focusedElement);
		return true;
	}
}
