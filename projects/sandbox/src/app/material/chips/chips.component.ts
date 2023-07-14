import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {
	MatLegacyAutocomplete as MatAutocomplete,
	MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent
} from '@angular/material/legacy-autocomplete';
import {MatLegacyChipInputEvent as MatChipInputEvent} from '@angular/material/legacy-chips';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'sb-chips',
	templateUrl: './chips.component.html'
})
export class ChipsComponent implements OnInit {
	showAutocompleteForm = false;
	color: ThemePalette = null;
	variant: string = null;
	disabled = false;
	selected = false;
	readonly colors: ThemePalette[] = [null, 'warn', 'primary', 'accent'];
	readonly variants: string[] = [null, 'info', 'success', 'warning', 'error'];
	readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

	private stacked = false;
	private readonly tagsCtrl = new UntypedFormControl();
	private filteredTags: Observable<string[]>;
	private readonly allTags = ['IT', 'Sales', 'Marketing', 'Management', 'HR', 'Cleaning'];
	private readonly tags = this.allTags.splice(0, 3);

	@ViewChild('tagInput', {static: false}) private readonly tagInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', {static: false}) private readonly matAutocomplete: MatAutocomplete;

	ngOnInit(): void {
		this.color = this.colors[0];
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(map((tag: string | null) => (tag ? this.filter(tag) : this.remainingTags())));
	}

	toggleStacked(): void {
		this.stacked = !this.stacked;
	}

	toggleAutocompleteForm(): void {
		this.showAutocompleteForm = !this.showAutocompleteForm;
	}

	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
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
		this.tagInput.nativeElement.value = '';
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
