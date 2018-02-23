import {ElementRef} from '@angular/core';

export class NavTreeDomUtil {

	public static EVENT_TOGGLE_COLLAPSED = 'or.navTree.item.toggleCollapsed';

	private static readonly ItemWrapperSelector = 'ul.nav.nav-tree.expanded > li.nav-item:not(.nav-header):not(.disabled)';

	private static readonly ItemContentSelector = 'a';

	public static findClosest(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement || !element.nativeElement.parentElement) {
			return null;
		}
		if (element.nativeElement.parentElement.closest) {
			return element.nativeElement.parentElement.closest(NavTreeDomUtil.ItemWrapperSelector);
		}
		let parent = element.nativeElement.parentElement;
		while (parent && !this.matches(parent)) {
			parent = parent.parentElement;
		}
		return parent ? new ElementRef(parent) : null;
	}

	public static findFirstDescendant(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement) {
			return null;
		}
		let descendant = element.nativeElement.querySelector(NavTreeDomUtil.ItemWrapperSelector);
		return descendant ? new ElementRef(descendant) : null;
	}

	public static findLastDescendant(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement) {
			return null;
		}
		let descendants = element.nativeElement.querySelectorAll(NavTreeDomUtil.ItemWrapperSelector);
		return descendants.length > 0 ? new ElementRef(descendants[descendants.length - 1]) : null;
	}

	public static findNextSibling(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement) {
			return null;
		}
		let sibling = element.nativeElement.nextElementSibling;
		while (sibling && !this.matches(sibling)) {
			sibling = sibling.nextElementSibling;
		}
		return sibling ? new ElementRef(sibling) : null;
	}

	public static findPreviousSibling(element: ElementRef): ElementRef {
		if (!element || !element.nativeElement) {
			return null;
		}
		let sibling = element.nativeElement.previousElementSibling;
		while (sibling && !this.matches(sibling)) {
			sibling = sibling.previousElementSibling;
		}
		return sibling ? new ElementRef(sibling) : null;
	}

	public static findLink(element: ElementRef) {
		if (!element || !element.nativeElement) {
			return null;
		}
		let link = element.nativeElement.querySelector(NavTreeDomUtil.ItemContentSelector);
		return link ? new ElementRef(link) : null;
	}

	public static matches(element): boolean {
		if (element.msMatchesSelector) {
			return element.msMatchesSelector(NavTreeDomUtil.ItemWrapperSelector);
		} else if (element.webkitMatchesSelector) {
			return element.webkitMatchesSelector(NavTreeDomUtil.ItemWrapperSelector);
		} else {
			return element.matches(NavTreeDomUtil.ItemWrapperSelector);
		}
	}

	public static contains(parent: ElementRef, descendant: ElementRef) {
		return parent && descendant && parent.nativeElement && parent.nativeElement.contains(descendant.nativeElement);
	}

	public static triggerClick(element: ElementRef) {
		let link = NavTreeDomUtil.findLink(element);
		if (link && link.nativeElement) {
			link.nativeElement.click();
		}
	}

	public static triggerToggleCollapsed(element: ElementRef) {
		if (!element || !element.nativeElement) {
			return;
		}
		let event;
		if (CustomEvent && typeof CustomEvent === 'function') {
			event = new CustomEvent(NavTreeDomUtil.EVENT_TOGGLE_COLLAPSED);
		} else { // Some browsers (IE) don't support Event constructors
			event = document.createEvent('Event');
			event.initEvent(NavTreeDomUtil.EVENT_TOGGLE_COLLAPSED, false, true);
		}
		element.nativeElement.dispatchEvent(event);
	}

	public static ensureInView(element: ElementRef): void {
		let link = NavTreeDomUtil.findLink(element);
		if (link && link.nativeElement) {
			link.nativeElement.scrollIntoView({behavior: 'auto', inline: 'center'});
		}
	}
}
