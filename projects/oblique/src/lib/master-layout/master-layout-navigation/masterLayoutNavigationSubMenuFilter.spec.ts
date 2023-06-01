import {fromEvent} from 'rxjs';
import {fakeAsync, tick} from '@angular/core/testing';
import {obMasterLayoutNavigationSubMenuFilter} from './masterLayoutNavigationSubMenuFilter';

describe(`${obMasterLayoutNavigationSubMenuFilter.name}`, () => {
	test('that a MouseEvent is emitted on document click', done => {
		fromEvent(document, 'click')
			.pipe(obMasterLayoutNavigationSubMenuFilter())
			.subscribe(event => {
				expect(event instanceof MouseEvent).toBe(true);
				done();
			});
		document.querySelector('body').click();
	});

	test.each<{elementTag: keyof HTMLElementTagNameMap; classes: string[]; expected: boolean}>([
		{elementTag: 'div', classes: ['ob-sub-menu'], expected: false},
		{elementTag: 'button', classes: ['ob-sub-menu-close-button'], expected: true},
		{elementTag: 'button', classes: ['ob-sub-menu-go-to-children-button'], expected: false},
		{elementTag: 'a', classes: ['ob-master-layout-navigation-link'], expected: true},
		{elementTag: 'a', classes: ['ob-master-layout-navigation-link', 'ob-main-nav-link'], expected: true},
		{elementTag: 'button', classes: ['ob-master-layout-navigation-link', 'ob-main-nav-link'], expected: true},
		{elementTag: 'button', classes: ['ob-fake-button'], expected: true}
	])(
		'that a click of $elementTag element with class(es): $classes will result in emitted being $expected',
		fakeAsync(({elementTag, classes, expected}) => {
			const element: HTMLElement = document.createElement(elementTag);
			element.classList.add(classes);
			document.querySelector('body').appendChild(element);
			let emitted = false;
			fromEvent(document, 'click')
				.pipe(obMasterLayoutNavigationSubMenuFilter())
				.subscribe(() => {
					emitted = true;
				});
			element.click();
			tick(1000);
			expect(emitted).toBe(expected);
		})
	);

	test.each<{elementTag: keyof HTMLElementTagNameMap; classes: string[]; expected: boolean}>([
		{elementTag: 'button', classes: ['ob-sub-menu-back-button'], expected: false},
		{elementTag: 'div', classes: ['ob-sub-menu-back-close-container'], expected: false},
		{elementTag: 'a', classes: ['ob-fake-link'], expected: false},
		{elementTag: 'button', classes: ['ob-sub-menu-close-button'], expected: true},
		{elementTag: 'a', classes: ['ob-master-layout-navigation-link'], expected: true},
		{elementTag: 'a', classes: ['ob-master-layout-navigation-link', 'ob-main-nav-link'], expected: false},
		{elementTag: 'button', classes: ['ob-master-layout-navigation-link', 'ob-main-nav-link'], expected: false}
	])(
		'that a click of $elementTag element with class(es): $classes within: div.ob-sub-menu will result in emitted being $expected',
		fakeAsync(({elementTag, classes, expected}) => {
			const obSubMenu: HTMLDivElement = document.createElement('div');
			obSubMenu.classList.add('ob-sub-menu');
			const element: HTMLElement = document.createElement(elementTag);
			element.classList.add(classes);
			obSubMenu.appendChild(element);
			document.querySelector('body').appendChild(obSubMenu);
			let emitted = false;
			fromEvent(document, 'click')
				.pipe(obMasterLayoutNavigationSubMenuFilter())
				.subscribe(() => {
					emitted = true;
				});
			element.click();
			tick(1000);
			expect(emitted).toBe(expected);
		})
	);
});
