import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export function obMasterLayoutNavigationSubMenuFilter(): (source$: Observable<Event>) => Observable<Event> {
	return source$ => source$.pipe(filter(target => !isWithinSubMenu(target) || isWithinClosingElement(target)));
}

function isWithinCloseButton(target: KeyboardEvent | Event): boolean {
	return isWithinElement(target, '.ob-sub-menu-close-button');
}

function isWithinClosingElement(target: KeyboardEvent | Event): boolean {
	return isWithinCloseButton(target) || isWithinSubMenuLink(target);
}

function isWithinElement(target: Event | KeyboardEvent, selector: string): boolean {
	const eventTarget = target?.target as Element;
	return eventTarget?.closest ? !!eventTarget.closest(selector) : false;
}

function isWithinSubMenu(target: KeyboardEvent | Event): boolean {
	return isWithinElement(target, '.ob-sub-menu') || isWithinElement(target, '.ob-sub-menu-go-to-children-button');
}

function isWithinSubMenuLink(target: KeyboardEvent | Event): boolean {
	return isWithinElement(target, '.ob-master-layout-navigation-link:not(.ob-main-nav-link)');
}
