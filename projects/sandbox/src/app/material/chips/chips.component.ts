import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'sb-chips',
	templateUrl: './chips.component.html',
	styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
	color: ThemePalette = null;
	disabled = false;
	filteredTags: Observable<string[]>;
	showAutocompleteForm = false;
	stacked = false;
	variant: string = null;

	readonly allTags = ['IT', 'Sales', 'Marketing', 'Management', 'HR', 'Cleaning'];
	readonly colors: ThemePalette[] = [null, 'warn', 'primary', 'accent'];
	readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON];
	readonly tags = this.allTags.splice(0, 3);
	readonly tagsCtrl = new UntypedFormControl();
	readonly variants: string[] = [null, 'info', 'success', 'warning', 'error'];

	@ViewChild('tagInput', {static: false}) private readonly tagInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', {static: false}) private readonly matAutocomplete: MatAutocomplete;

	ngOnInit(): void {
		this.color = this.colors[0];
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(map((tag: string | null) => (tag ? this.filter(tag) : this.remainingTags())));
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
