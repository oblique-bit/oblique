import {Component, type ElementRef, type OnInit, viewChild} from '@angular/core';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import type {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import type {MatChipInputEvent} from '@angular/material/chips';
import type {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'sb-chips',
	standalone: false,
	templateUrl: './chips.component.html',
	styleUrl: './chips.component.scss',
})
export class ChipsComponent implements OnInit {
	disabled = false;
	filteredTags: Observable<string[]>;
	showAutocompleteForm = false;
	stacked = false;
	variant: string = null;
	type: (typeof this.types)[number] = 'mat-chip-row';

	readonly allTags = ['IT', 'Sales', 'Marketing', 'Management', 'HR', 'Cleaning'];
	readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON];
	readonly tags = this.allTags.splice(0, 3);
	readonly tagsCtrl = new UntypedFormControl();
	readonly variants: string[] = [null, 'info', 'success', 'warning', 'error'];
	readonly types: string[] = ['mat-chip-row', 'mat-chip-option', 'mat-chip'];

	readonly tagInput = viewChild<ElementRef<HTMLInputElement>>('tagInput');
	readonly matAutocomplete = viewChild<MatAutocomplete>('auto');

	ngOnInit(): void {
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(
			map((tag: string | null) => (tag ? this.filter(tag) : this.remainingTags()))
		);
	}

	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete().isOpen) {
			const {input, value} = event;

			if ((value || '').trim()) {
				this.tags.push(value.trim());
			}
			input.value = '';
			this.tagsCtrl.setValue(null);
		}
	}

	remove(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	select(event: MatAutocompleteSelectedEvent): void {
		this.tags.push(event.option.viewValue);
		this.tagInput().nativeElement.value = '';
		this.tagsCtrl.setValue(null);
	}

	private filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allTags.filter(tag => tag.toLowerCase().startsWith(filterValue));
	}

	private remainingTags(): string[] {
		return this.allTags.filter(tag => !this.tags.includes(tag));
	}
}
