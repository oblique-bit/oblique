import {ObPaginatorDirective} from './paginator.directive';
import {ElementRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';

describe(ObPaginatorDirective.name, () => {
	let paginator: MatPaginator;
	let directive: ObPaginatorDirective;

	const obPaginatorDirectiveBeforeEach = (
		panelClassInput?: string | string[] | Set<string> | Record<string, any>,
		closest: (selector: string) => boolean = () => false
	): void => {
		paginator = {selectConfig: {panelClass: panelClassInput}} as unknown as MatPaginator;
		directive = new ObPaginatorDirective(
			{
				nativeElement: {closest}
			} as ElementRef,
			paginator
		);
		directive.ngAfterContentInit();
	};

	test('that creation works', () => {
		obPaginatorDirectiveBeforeEach();
		expect(directive).toBeTruthy();
	});

	test('that it sets select panelClass to ob-select-panel when it was previously falsy', () => {
		obPaginatorDirectiveBeforeEach();
		expect(paginator.selectConfig.panelClass).toEqual('ob-select-panel');
	});

	test('that it adds ob-select-panel to select panelClass when it is a truthy string', () => {
		obPaginatorDirectiveBeforeEach('bla');
		expect(paginator.selectConfig.panelClass).toEqual('bla ob-select-panel');
	});

	test.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(1)},
		{
			description: 'ensure class at index 0 is ob-select-panel',
			expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('ob-select-panel')
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty string[] - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach([]);
		const panelClass: string[] = paginator.selectConfig.panelClass as string[];
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 2', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(2)},
		{description: 'ensure class at index 0 is bla', expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('bla')},
		{
			description: 'ensure class at index 0 is ob-select-panel',
			expected: (panelClass: string[]) => expect(panelClass[1]).toEqual('ob-select-panel')
		}
	])('that it adds ob-select-panel to select panelClass when it is a string[] - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach(['bla']);
		const panelClass: string[] = paginator.selectConfig.panelClass as string[];
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 1', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(1)},
		{
			description: 'ensure value at index 0 is ob-select-panel',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select-panel')).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty Set<string> - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach(new Set<string>());
		const panelClass: Set<string> = paginator.selectConfig.panelClass as Set<string>;
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 2', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(2)},
		{
			description: 'ensure value at index 0 is bla',
			expected: (panelClass: Set<string>) => expect(panelClass.has('bla')).toBeTruthy()
		},
		{
			description: 'ensure value at index 1 is ob-select-panel',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select-panel')).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is a Set<string> - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach(new Set<string>(['bla']));
		const panelClass: Set<string> = paginator.selectConfig.panelClass as Set<string>;
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(1)},
		{
			description: 'ensure ob-select-panel is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select-panel']).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty Record<string, any> - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach({});
		const panelClass: Record<string, any> = paginator.selectConfig.panelClass as Record<string, any>;
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 2', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(2)},
		{
			description: 'ensure bla is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass.bla).toBeTruthy()
		},
		{
			description: 'ensure ob-select-panel is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select-panel']).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is a Record<string, any> - $description', ({expected}) => {
		obPaginatorDirectiveBeforeEach({bla: true});
		const panelClass: Record<string, any> = paginator.selectConfig.panelClass as Record<string, any>;
		expected(panelClass);
	});

	test.each<{selector: string}>([{selector: '.ob-form-sm'}, {selector: '.mat-form-field-sm'}])(
		`that it adds ob-select-panel-sm to select panelClass when $selector matches on host or one if it's parent elements`,
		({selector}) => {
			obPaginatorDirectiveBeforeEach('bla', (sel: string) => sel === selector);
			expect((paginator.selectConfig.panelClass as string).includes('ob-select-panel-sm')).toBeTruthy();
		}
	);

	test(`that it does not add ob-select-panel-sm when no matches are found for .ob-form-sm or .mat-form-field-sm on host or one if it's parent elements`, () => {
		obPaginatorDirectiveBeforeEach('bla');
		expect((paginator.selectConfig.panelClass as string).includes('ob-select-panel-sm')).toBeFalsy();
	});
});
