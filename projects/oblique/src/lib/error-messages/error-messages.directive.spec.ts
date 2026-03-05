import {FormGroupDirective, NgForm} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {Subject, firstValueFrom} from 'rxjs';
import {ObErrorMessagesDirective} from './error-messages.directive';

describe(ObErrorMessagesDirective.name, () => {
	let directive: ObErrorMessagesDirective;

	it('should throw if no form is provided', () => {
		expect(() => {
			directive = new ObErrorMessagesDirective(null, null);
		}).toThrow('The ErrorMessagesDirective needs to be either within a NgForm or a FormGroupDirective!');
	});

	describe('with a NgForm and without control', () => {
		let mockSubmit: EventEmitter<void>;
		let mockStatusChange: Subject<void>;

		beforeEach(() => {
			mockSubmit = new EventEmitter();
			mockStatusChange = new Subject();
			directive = new ObErrorMessagesDirective({ngSubmit: mockSubmit} as NgForm, null);
		});

		afterEach(() => {
			directive.ngOnDestroy();
		});

		it('should not emit', () => {
			const spy = jest.fn();

			directive.errors$.subscribe(spy);
			directive.ngAfterViewInit();
			mockSubmit.next();
			mockStatusChange.next();

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe.each(['matInput', 'matSelect'])('with a NgForm and %s', control => {
		const errors = {required: true};
		let mockSubmit: EventEmitter<void>;
		let mockStatusChange: Subject<void>;

		beforeEach(() => {
			mockSubmit = new EventEmitter();
			mockStatusChange = new Subject();
			directive = new ObErrorMessagesDirective({ngSubmit: mockSubmit} as NgForm, null);
			directive[control] = {ngControl: {errors, statusChanges: mockStatusChange}};
		});

		afterEach(() => {
			directive.ngOnDestroy();
		});

		it('should emit initial errors', async () => {
			const validationErrors = firstValueFrom(directive.errors$);

			directive.ngAfterViewInit();

			expect(await validationErrors).toEqual(errors);
		});

		it('should emit on submit', async () => {
			directive.ngAfterViewInit();
			const validationErrors = firstValueFrom(directive.errors$);
			mockSubmit.next();

			expect(await validationErrors).toEqual(errors);
		});

		it('should emit on status change', async () => {
			directive.ngAfterViewInit();
			const validationErrors = firstValueFrom(directive.errors$);
			mockStatusChange.next();

			expect(await validationErrors).toEqual(errors);
		});
	});

	describe.each(['matInput', 'matSelect'])('with a FormGroupDirective and %s', control => {
		const errors = {required: true};
		let mockSubmit: EventEmitter<void>;
		let mockStatusChange: Subject<void>;

		beforeEach(() => {
			mockSubmit = new EventEmitter();
			mockStatusChange = new Subject();
			directive = new ObErrorMessagesDirective(null, {ngSubmit: mockSubmit} as FormGroupDirective);
			directive[control] = {ngControl: {errors, statusChanges: mockStatusChange}};
		});

		afterEach(() => {
			directive.ngOnDestroy();
		});

		it('should emit initial errors', async () => {
			const validationErrors = firstValueFrom(directive.errors$);

			directive.ngAfterViewInit();

			expect(await validationErrors).toEqual(errors);
		});

		it('should emit on submit', async () => {
			directive.ngAfterViewInit();
			const validationErrors = firstValueFrom(directive.errors$);
			mockSubmit.next();

			expect(await validationErrors).toEqual(errors);
		});

		it('should emit on status change', async () => {
			directive.ngAfterViewInit();
			const validationErrors = firstValueFrom(directive.errors$);
			mockStatusChange.next();

			expect(await validationErrors).toEqual(errors);
		});
	});
});
