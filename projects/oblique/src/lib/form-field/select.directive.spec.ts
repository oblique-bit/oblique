import {MatSelect} from '@angular/material/select';
import {ObSelectDirective} from './select.directive';
import {BehaviorSubject} from 'rxjs';
import {ElementRef} from '@angular/core';

describe(`${ObSelectDirective.name}`, () => {
	let select: MatSelect;
	let directive: ObSelectDirective;

	const obSelectDirectiveBeforeEach = (
		panelClassInput?: string | string[] | Set<string> | Record<string, any>,
		closest: (selector: string) => boolean = () => false
	): void => {
		const openedChange = new BehaviorSubject<boolean>(false);
		select = {panelClass: panelClassInput, openedChange} as unknown as MatSelect;
		directive = new ObSelectDirective(
			{
				nativeElement: {closest}
			} as ElementRef,
			select
		);
		directive.ngOnInit();
		directive.ngAfterContentInit();
	};

	afterEach(() => {
		directive.ngOnDestroy();
	});

	it(`should create an instance`, () => {
		obSelectDirectiveBeforeEach();
		expect(directive).toBeTruthy();
	});

	it('should set select panelClass to ob-select-panel when it was previously falsy', () => {
		obSelectDirectiveBeforeEach();
		expect(select.panelClass).toEqual('ob-select-panel');
	});

	it('should add ob-select-panel to select panelClass when it is a truthy string', () => {
		obSelectDirectiveBeforeEach('bla');
		expect(select.panelClass).toEqual('bla ob-select-panel');
	});

	it.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(1)},
		{
			description: 'ensure class at index 0 is ob-select-panel',
			expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('ob-select-panel')
		}
	])('should add ob-select-panel to select panelClass when it is an empty string[] - $description', ({expected}) => {
		obSelectDirectiveBeforeEach([]);
		const panelClass: string[] = select.panelClass as string[];
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 2', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(2)},
		{description: 'ensure class at index 0 is bla', expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('bla')},
		{
			description: 'ensure class at index 0 is ob-select-panel',
			expected: (panelClass: string[]) => expect(panelClass[1]).toEqual('ob-select-panel')
		}
	])('should add ob-select-panel to select panelClass when it is a string[] - $description', ({expected}) => {
		obSelectDirectiveBeforeEach(['bla']);
		const panelClass: string[] = select.panelClass as string[];
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 1', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(1)},
		{
			description: 'ensure value at index 0 is ob-select-panel',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select-panel')).toBeTruthy()
		}
	])('should add ob-select-panel to select panelClass when it is an empty Set<string> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach(new Set<string>());
		const panelClass: Set<string> = select.panelClass as Set<string>;
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 2', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(2)},
		{
			description: 'ensure value at index 0 is bla',
			expected: (panelClass: Set<string>) => expect(panelClass.has('bla')).toBeTruthy()
		},
		{
			description: 'ensure value at index 1 is ob-select-panel',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select-panel')).toBeTruthy()
		}
	])('should add ob-select-panel to select panelClass when it is a Set<string> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach(new Set<string>(['bla']));
		const panelClass: Set<string> = select.panelClass as Set<string>;
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(1)},
		{
			description: 'ensure ob-select-panel is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select-panel']).toBeTruthy()
		}
	])('should add ob-select-panel to select panelClass when it is an empty Record<string, any> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach({});
		const panelClass: Record<string, any> = select.panelClass as Record<string, any>;
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 2', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(2)},
		{
			description: 'ensure bla is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass.bla).toBeTruthy()
		},
		{
			description: 'ensure ob-select-panel is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select-panel']).toBeTruthy()
		}
	])('should add ob-select-panel to select panelClass when it is a Record<string, any> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach({bla: true});
		const panelClass: Record<string, any> = select.panelClass as Record<string, any>;
		expected(panelClass);
	});

	it.each<{selector: string}>([{selector: '.ob-form-sm'}, {selector: '.mat-form-field-sm'}])(
		`should add ob-select-panel-sm to select panelClass when $selector matches on host or one if it's parent elements`,
		({selector}) => {
			obSelectDirectiveBeforeEach('bla', (sel: string) => sel === selector);
			expect((select.panelClass as string).includes('ob-select-panel-sm')).toBeTruthy();
		}
	);

	it(`should not add ob-select-panel-sm when no matches are found for .ob-form-sm or .mat-form-field-sm on host or one if it's parent elements`, () => {
		obSelectDirectiveBeforeEach('bla');
		expect((select.panelClass as string).includes('ob-select-panel-sm')).toBeFalsy();
	});
});
