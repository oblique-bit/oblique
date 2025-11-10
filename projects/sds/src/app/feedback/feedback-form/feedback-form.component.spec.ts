import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {FeedbackFormComponent} from './feedback-form.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import type {Fields} from './feedback-form.model';

describe(FeedbackFormComponent.name, () => {
	let component: FeedbackFormComponent;
	let fixture: ComponentFixture<FeedbackFormComponent>;
	let dialogRef: {close: jest.Mock};

	beforeEach(async () => {
		dialogRef = {
			close: jest.fn(),
		};
		await TestBed.configureTestingModule({
			imports: [MatDialogModule],
			providers: [{provide: MAT_DIALOG_DATA, useValue: {}}, {provide: MatDialogRef, useValue: dialogRef}, MatDialog],
		}).compileComponents();
		fixture = TestBed.createComponent(FeedbackFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	describe('property formGroup', () => {
		test('that it exists', () => {
			expect(component.formGroup).toBeDefined();
		});
		test('that it is a FormGroup', () => {
			expect(component.formGroup instanceof FormGroup).toBe(true);
		});
		test('that it has 5 controls', () => {
			expect(Object.keys(component.formGroup.controls).length).toBe(5);
		});
		test.each(['summary', 'description', 'url', 'name', 'email'])('that it has a %s control', control => {
			expect(component.formGroup.controls[control]).toBeDefined();
		});
	});

	describe('property errors', () => {
		test('that it exists', () => {
			expect(component.errors).toBeDefined();
		});
		test('that it has 5 entries', () => {
			expect(Object.keys(component.errors).length).toBe(5);
		});
		test.each(['summary$', 'description$', 'url$', 'name$', 'email$'])('that it has a %s child', control => {
			expect(component.errors[control]).toBeDefined();
		});
		test.each(['summary$', 'description$', 'url$', 'name$', 'email$'])('that %s is an Observable', control => {
			expect(component.errors[control] instanceof Observable).toBe(true);
		});
	});

	describe.each(['charactersUsed$', 'body$'])('property %s', property => {
		test('that it exists', () => {
			expect(component[property]).toBeDefined();
		});
		test('that it is an Observable', () => {
			expect(component[property] instanceof Observable).toBe(true);
		});
	});

	describe(FeedbackFormComponent.prototype.close.name, () => {
		beforeEach(() => {
			component.close();
		});
		test('that it closes the dialog', () => {
			expect(dialogRef.close).toHaveBeenCalled();
		});
	});

	describe(FeedbackFormComponent.prototype.reset.name, () => {
		const event = {preventDefault: jest.fn()} as unknown as MouseEvent;
		beforeEach(() => {
			jest.spyOn(component.formGroup, 'reset');
			component.reset(event);
		});
		test('that the default action have been prevented', () => {
			expect(event.preventDefault).toHaveBeenCalled();
		});
		test('that it resets the form', () => {
			expect(component.formGroup.reset).toHaveBeenCalled();
		});
	});

	describe('validation', () => {
		describe.each(['summary', 'description', 'url', 'name', 'email'])('required', control => {
			test(`that ${control} emits an error when empty`, done => {
				component.errors[`${control}$` as Fields].subscribe(error => {
					expect(error).toBe(`Please enter a ${control}`);
					done();
				});
				component.formGroup.patchValue({[control]: 'a'});
				component.formGroup.patchValue({[control]: ''});
			});
		});
	});

	describe('summary', () => {
		test('that is emits an error when empty', done => {
			component.errors.summary$.subscribe(error => {
				expect(error).toBe('Please enter a summary');
				done();
			});
			component.formGroup.patchValue({summary: 'a'});
			component.formGroup.patchValue({summary: ''});
		});
	});

	describe('description', () => {
		test('that is emits an error when empty', done => {
			component.errors.description$.subscribe(error => {
				expect(error).toBe('Please enter a description');
				done();
			});
			component.formGroup.patchValue({description: 'a'});
			component.formGroup.patchValue({description: ''});
		});
	});
});
