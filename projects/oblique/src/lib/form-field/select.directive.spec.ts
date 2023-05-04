import {MatLegacySelect} from '@angular/material/legacy-select';
import {ObSelectDirective} from './select.directive';
import {BehaviorSubject} from 'rxjs';

describe(`${ObSelectDirective.name}`, () => {
	let select: MatLegacySelect;
	let directive: ObSelectDirective;

	const obSelectDirectiveBeforeEach = (panelClassInput?: string | string[] | Set<string> | Record<string, any>): void => {
		const openedChange = new BehaviorSubject<boolean>(false);
		select = {panelClass: panelClassInput, openedChange} as unknown as MatLegacySelect;
		directive = new ObSelectDirective(select);
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

	it('should set select panelClass to ob-select when it was previously falsy', () => {
		obSelectDirectiveBeforeEach();
		expect(select.panelClass).toEqual('ob-select');
	});

	it('should add ob-select to select panelClass when it is a truthy string', () => {
		obSelectDirectiveBeforeEach('bla');
		expect(select.panelClass).toEqual('bla ob-select');
	});

	it.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(1)},
		{description: 'ensure class at index 0 is ob-select', expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('ob-select')}
	])('should add ob-select to select panelClass when it is an empty string[] - $description', ({expected}) => {
		obSelectDirectiveBeforeEach([]);
		const panelClass: string[] = select.panelClass as string[];
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 2', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(2)},
		{description: 'ensure class at index 0 is bla', expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('bla')},
		{description: 'ensure class at index 0 is ob-select', expected: (panelClass: string[]) => expect(panelClass[1]).toEqual('ob-select')}
	])('should add ob-select to select panelClass when it is a string[] - $description', ({expected}) => {
		obSelectDirectiveBeforeEach(['bla']);
		const panelClass: string[] = select.panelClass as string[];
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 1', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(1)},
		{
			description: 'ensure value at index 0 is ob-select',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select')).toBeTruthy()
		}
	])('should add ob-select to select panelClass when it is an empty Set<string> - $description', ({expected}) => {
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
			description: 'ensure value at index 1 is ob-select',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select')).toBeTruthy()
		}
	])('should add ob-select to select panelClass when it is a Set<string> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach(new Set<string>(['bla']));
		const panelClass: Set<string> = select.panelClass as Set<string>;
		expected(panelClass);
	});

	it.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(1)},
		{description: 'ensure ob-select is truthy', expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select']).toBeTruthy()}
	])('should add ob-select to select panelClass when it is an empty Record<string, any> - $description', ({expected}) => {
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
		{description: 'ensure ob-select is truthy', expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select']).toBeTruthy()}
	])('should add ob-select to select panelClass when it is a Record<string, any> - $description', ({expected}) => {
		obSelectDirectiveBeforeEach({bla: true});
		const panelClass: Record<string, any> = select.panelClass as Record<string, any>;
		expected(panelClass);
	});
});
