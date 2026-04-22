import {Component, computed, effect, inject, signal} from '@angular/core';
import {
	ObAutocompleteComponent,
	ObButtonModule,
	ObColumnLayoutModule,
	ObErrorMessagesDirective,
	ObInputClearModule,
	ObMatErrorDirective,
} from '@oblique/oblique';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {type LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {formatDate} from '@angular/common';

@Component({
	selector: 'sb-form-combinations',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatAutocompleteModule,
		MatDatepickerModule,
		MatButtonModule,
		MatIconModule,
		MatSlideToggleModule,
		MatRadioModule,
		ObButtonModule,
		ObColumnLayoutModule,
		ObInputClearModule,
		TranslatePipe,
		ObAutocompleteComponent,
		ObErrorMessagesDirective,
		ObMatErrorDirective,
	],
	templateUrl: './form-sample-combinations.component.html',
	styleUrl: './form-sample-combinations.component.scss',
})
export class FormSampleCombinationsComponent {
	readonly autocompleteOptions = signal([
		{label: 'Angular'},
		{label: 'React'},
		{label: 'Vue'},
		{label: 'Svelte'},
		{label: 'Solid'},
	]);

	readonly selectOptions = signal(['Option A', 'Option B', 'Option C', 'Option D']);
	readonly placeholder = signal('');
	readonly isDisabled = signal(false);
	readonly longHintText = signal(
		'This is a super-duper long hint. No really, it is. You might want to grab a coffee before reading this. Or a meal.' +
			"Actually, cancel your evening plans. This hint was originally a short hint, but it went to therapy, found its inner voice, and now it won't stop talking. " +
			"If you've read this far, congratulations: you've spent more time reading a hint than most people have spent reading README files. The person who wrote this hint is still writing. " +
			"They can't stop. Send help, or at least a shorter requirement. Fun fact: this hint is now longer than the component it documents. " +
			"Another fun fact: you're still reading. The real hint was the friend we made along the way. Just kidding. " +
			"The real hint is: please just pass a valid string. That's it. That's all we ever wanted, but did we say that in 5 words? No. Because we are super-duper."
	);
	readonly shortHintText = signal('Short hint: add text here');
	readonly formBuilder = inject(FormBuilder);
	readonly controls = this.formBuilder.nonNullable.group({
		size: [''],
		iconPrefix: [false],
		iconSuffix: [false],
		textPrefix: [false],
		textSuffix: [false],
		placeholder: [false],
		prefilled: [false],
		disabled: [false],
		inputClear: [false],
		longHint: [false],
		shortHint: [false],
		endHint: [false],
		error: [false],
	});
	readonly dateValue = computed(() => {
		const language = this.languageChange().lang;
		const locale = this.mapLanguageToLocale(language);
		return formatDate(new Date(), 'shortDate', locale);
	});

	readonly form = this.formBuilder.group({
		input: [{value: '', disabled: false}, [Validators.required]],
		autocomplete: [{value: '', disabled: false}, Validators.required],
		textarea: [{value: '', disabled: false}, Validators.required],
		select: [{value: '', disabled: false}, Validators.required],
		datepicker: [{value: undefined, disabled: false}, Validators.required],
	});

	private readonly languageService = inject(TranslateService);
	private readonly disabledChange = toSignal(this.controls.get('disabled').valueChanges);
	private readonly errorChange = toSignal(this.controls.get('error').valueChanges);
	private readonly placeholderChange = toSignal(this.controls.get('placeholder').valueChanges);
	private readonly prefilledChange = toSignal(this.controls.get('prefilled').valueChanges);
	private readonly localeMap = {
		fr: 'fr-CH',
		en: 'en-US',
	} as const;
	private readonly languageChange = toSignal(this.languageService.onLangChange, {
		initialValue: {
			lang: this.languageService.getCurrentLang(),
			translations: {},
		} as LangChangeEvent,
	});

	constructor() {
		this.setupDisabled();
		this.setupPlaceholder();
		this.setupPrefilled();
		this.setupError();
	}

	submitForm(): void {
		this.form.markAllAsTouched();
	}

	resetForm(): void {
		this.controls.controls.error.setValue(false, {emitEvent: false});
		this.controls.controls.prefilled.setValue(false, {emitEvent: false});
		this.form.reset();
		this.form.markAsPristine();
		this.form.markAsUntouched();

		this.setFormsDisableOrEnableState(this.controls.controls.disabled.value);
	}

	private mapLanguageToLocale(language: string): string {
		return this.localeMap[language] ?? 'en-US';
	}

	private setupDisabled(): void {
		effect(() => {
			const isDisabled = this.disabledChange();
			this.setFormsDisableOrEnableState(isDisabled);
		});
	}

	private setFormsDisableOrEnableState(isDisabled: boolean): void {
		if (isDisabled) {
			this.form.disable();
		} else {
			this.form.enable();
		}
	}

	private setupPlaceholder(): void {
		effect(() => {
			this.placeholder.set(this.placeholderChange() ? 'Placeholder' : '');
		});
	}

	private setupPrefilled(): void {
		effect(() => {
			if (this.prefilledChange()) {
				this.applyPrefilledValues();
				return;
			}

			this.clearPrefilledValues();
		});
	}

	private applyPrefilledValues(): void {
		this.form.patchValue({
			input: 'Prefilled input content',
			autocomplete: this.autocompleteOptions()[0].label,
			textarea: 'Prefilled textarea content',
			select: this.selectOptions()[0],
			datepicker: new Date(),
		});
		this.form.markAsPristine();
		this.form.markAsUntouched();
	}

	private clearPrefilledValues(): void {
		this.form.reset();
		this.form.markAsUntouched();
	}

	private setupError(): void {
		effect(() => {
			const showErrorState = this.errorChange();

			if (showErrorState) {
				this.applyErrorState();
				return;
			}

			this.clearErrorState();
		});
	}

	private applyErrorState(): void {
		Object.values(this.form.controls).forEach(control => {
			control.markAsTouched();
			control.updateValueAndValidity();
		});
	}

	private clearErrorState(): void {
		this.form.markAsUntouched();
		this.form.markAsPristine();
		this.form.updateValueAndValidity();
	}
}
