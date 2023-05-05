import {ElementRef, Renderer2} from '@angular/core';
import {ObCheckboxDirective} from './checkbox.directive';
import {MatLegacyCheckbox} from '@angular/material/legacy-checkbox';
import {Subject} from 'rxjs';

describe(`${ObCheckboxDirective.name}`, () => {
	let directive: ObCheckboxDirective;

	const tableRow: Element = {} as Element;
	const addClass = jest.fn(() => {
		(tableRow as any).class = 'ob-table-row-checked';
	});
	const removeClass = jest.fn(() => {
		(tableRow as any).class = '';
	});
	let closest: jest.Mock;
	const change = new Subject<boolean>();

	const checkboxBeforeEach: (checked?: boolean, hasCheckedClass?: boolean, closestOverride?: jest.Mock) => void = (
		checked = false,
		hasCheckedClass = false,
		closestOverride = jest.fn((selector: string) => {
			if (selector.includes('ob-table-row-checked')) {
				if ((tableRow as any).class === 'ob-table-row-checked') {
					return tableRow;
				}

				return null;
			}

			return tableRow;
		})
	) => {
		change.next(checked);

		if (hasCheckedClass) {
			(tableRow as any).class = 'ob-table-row-checked';
		}

		closest = closestOverride;
		tableRow.closest = closest;

		directive = new ObCheckboxDirective(
			{nativeElement: {closest: (selector: string) => closest(selector)}} as unknown as ElementRef,
			{checked, change} as unknown as MatLegacyCheckbox,
			{addClass, removeClass} as unknown as Renderer2
		);
		directive.ngOnInit();
	};

	afterEach(() => {
		directive.ngOnDestroy();
		(tableRow as any).class = '';
		addClass.mockClear();
		removeClass.mockClear();
		closest.mockClear();
	});

	it('should create an instance', () => {
		checkboxBeforeEach();
		expect(directive).toBeTruthy();
	});

	it('should have called add class when checked is initially true', () => {
		checkboxBeforeEach(true);
		expect(addClass).toHaveBeenCalled();
	});

	it('should not have called remove class when checked is initially true', () => {
		checkboxBeforeEach(true);
		expect(removeClass).not.toHaveBeenCalled();
	});

	it('should have called remove class when checked is initially false & row has checked class', () => {
		checkboxBeforeEach(false, true);
		expect(removeClass).toHaveBeenCalled();
	});

	it('should not have called add class when checked is initially false & row has checked class', () => {
		checkboxBeforeEach(false, true);
		expect(addClass).not.toHaveBeenCalled();
	});

	it('should not call addClass if no table row is found', () => {
		checkboxBeforeEach(
			true,
			false,
			jest.fn(() => null)
		);
		expect(addClass).not.toHaveBeenCalled();
	});

	it('should not call have called addClass after calling ngOnDestroy', () => {
		checkboxBeforeEach();
		directive.ngOnDestroy();
		expect(addClass).not.toHaveBeenCalled();
	});
});
