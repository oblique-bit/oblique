import {Component, inject} from '@angular/core';
import {type AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {type Observable, debounceTime, map, startWith} from 'rxjs';
import type {Fields, RequiredLength} from './feedback-form.model';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-feedback',
	imports: [
		AsyncPipe,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		ObButtonModule,
		ReactiveFormsModule,
	],
	templateUrl: './feedback-form.component.html',
	styleUrl: './feedback-form.component.scss',
})
export class FeedbackFormComponent {
	readonly formGroup = new FormGroup({});
	readonly errors: Record<Fields, Observable<string>> = {
		summary$: undefined,
		description$: undefined,
		url$: undefined,
		name$: undefined,
		email$: undefined,
	};
	readonly charactersUsed$: Observable<number>;
	readonly body$ = this.formGroup.valueChanges.pipe(
		debounceTime(200),
		map(value =>
			Object.keys(value)
				.map(key => `${key[0].toUpperCase() + key.substring(1)}: ${value[key]}`)
				.join('%0D%0A%0D%0A')
		)
	);
	private readonly controls = [
		{name: 'summary', validators: [Validators.required]},
		{name: 'description', validators: [Validators.required, Validators.minLength(25), Validators.maxLength(3000)]},
		{name: 'url', validators: [Validators.required], defaultValue: window.location.pathname},
		{name: 'name', validators: [Validators.required]},
		{name: 'email', validators: [Validators.required, Validators.email]},
	];
	private readonly dialogRef = inject(MatDialogRef<any>);

	constructor() {
		this.controls.forEach(control => {
			this.formGroup.addControl(
				control.name,
				new FormControl<string>(control.defaultValue ?? '', {validators: control.validators, nonNullable: true})
			);
			this.errors[`${control.name}$`] = this.buildControl(control.name);
		});

		this.charactersUsed$ = this.formGroup.get('description').valueChanges.pipe(
			map((value: string) => value.length),
			startWith(0)
		);
	}

	close(): void {
		this.dialogRef.close();
	}

	reset(event: MouseEvent): void {
		event.preventDefault();
		this.formGroup.reset();
	}

	private buildControl(controlName: string): Observable<string> {
		const control = this.formGroup.get(controlName);
		return control.valueChanges.pipe(
			debounceTime(200),
			startWith(''),
			map(() => this.validateControl(control, controlName))
		);
	}

	private validateControl(control: AbstractControl, controlName: string): string {
		if (control.hasError('required')) {
			return `Please enter a ${controlName}`;
		}

		if (control.hasError('minlength')) {
			return this.validateMinLength(control.errors.minlength as RequiredLength);
		}

		if (control.hasError('maxlength')) {
			return this.validateMaxLength(control.errors.maxlength as RequiredLength);
		}

		if (control.hasError('email')) {
			return `Please enter a valid email.`;
		}

		return '';
	}

	private validateMinLength(errors: RequiredLength): string {
		const missing = errors.requiredLength - errors.actualLength;
		return `Please enter at least ${errors.requiredLength} characters. You still need ${missing} character${this.pluralize(missing)}.`;
	}

	private validateMaxLength(errors: RequiredLength): string {
		const overflowing = errors.actualLength - errors.requiredLength;
		return `Please enter at most ${errors.requiredLength} characters. You have ${overflowing} character${this.pluralize(
			overflowing
		)} too much.`;
	}

	private pluralize(amount: number): string {
		return amount <= 1 ? '' : 's';
	}
}
