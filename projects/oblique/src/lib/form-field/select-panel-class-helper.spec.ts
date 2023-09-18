import {MatSelect} from '@angular/material/select';
import {ObSelectPanelClassHelper} from './select-panel-class-helper';
import {MatPaginatorSelectConfig} from '@angular/material/paginator';

describe(ObSelectPanelClassHelper.name, () => {
	let select: MatSelect | MatPaginatorSelectConfig;
	let host: HTMLElement;

	const obSelectPanelClassHelperBeforeEach = (
		panelClassInput?: string | string[] | Set<string> | Record<string, any>,
		closest: (selector: string) => boolean = () => false
	): void => {
		select = {panelClass: panelClassInput} as unknown as MatSelect;
		host = {closest} as HTMLElement;
		ObSelectPanelClassHelper.ensureAdditionalClassesAreIncluded(host, select);
	};

	test('that it sets select panelClass to ob-select-panel when it was previously falsy', () => {
		obSelectPanelClassHelperBeforeEach();
		expect(select.panelClass).toEqual('ob-select-panel');
	});

	test('that it adds ob-select-panel to select panelClass when it is a truthy string', () => {
		obSelectPanelClassHelperBeforeEach('bla');
		expect(select.panelClass).toEqual('bla ob-select-panel');
	});

	test.each<{description: string; expected: (panelClass: string[]) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: string[]) => expect(panelClass.length).toEqual(1)},
		{
			description: 'ensure class at index 0 is ob-select-panel',
			expected: (panelClass: string[]) => expect(panelClass[0]).toEqual('ob-select-panel')
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty string[] - $description', ({expected}) => {
		obSelectPanelClassHelperBeforeEach([]);
		const panelClass: string[] = select.panelClass as string[];
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
		obSelectPanelClassHelperBeforeEach(['bla']);
		const panelClass: string[] = select.panelClass as string[];
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Set<string>) => void}>([
		{description: 'ensure size is 1', expected: (panelClass: Set<string>) => expect(panelClass.size).toEqual(1)},
		{
			description: 'ensure value at index 0 is ob-select-panel',
			expected: (panelClass: Set<string>) => expect(panelClass.has('ob-select-panel')).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty Set<string> - $description', ({expected}) => {
		obSelectPanelClassHelperBeforeEach(new Set<string>());
		const panelClass: Set<string> = select.panelClass as Set<string>;
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
		obSelectPanelClassHelperBeforeEach(new Set<string>(['bla']));
		const panelClass: Set<string> = select.panelClass as Set<string>;
		expected(panelClass);
	});

	test.each<{description: string; expected: (panelClass: Record<string, any>) => void}>([
		{description: 'ensure length is 1', expected: (panelClass: Record<string, any>) => expect(Object.keys(panelClass).length).toEqual(1)},
		{
			description: 'ensure ob-select-panel is truthy',
			expected: (panelClass: Record<string, any>) => expect(panelClass['ob-select-panel']).toBeTruthy()
		}
	])('that it adds ob-select-panel to select panelClass when it is an empty Record<string, any> - $description', ({expected}) => {
		obSelectPanelClassHelperBeforeEach({});
		const panelClass: Record<string, any> = select.panelClass as Record<string, any>;
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
		obSelectPanelClassHelperBeforeEach({bla: true});
		const panelClass: Record<string, any> = select.panelClass as Record<string, any>;
		expected(panelClass);
	});

	test.each<{selector: string}>([{selector: '.ob-form-sm'}, {selector: '.mat-form-field-sm'}])(
		`that it adds ob-select-panel-sm to select panelClass when $selector matches on host or one if it's parent elements`,
		({selector}) => {
			obSelectPanelClassHelperBeforeEach('bla', (sel: string) => sel === selector);
			expect((select.panelClass as string).includes('ob-select-panel-sm')).toBeTruthy();
		}
	);

	test(`that it does not add ob-select-panel-sm when no matches are found for .ob-form-sm or .mat-form-field-sm on host or one if it's parent elements`, () => {
		obSelectPanelClassHelperBeforeEach('bla');
		expect((select.panelClass as string).includes('ob-select-panel-sm')).toBeFalsy();
	});
});
