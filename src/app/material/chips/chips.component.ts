import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-chips',
	templateUrl: './chips.component.html'
})
export class ObChipsComponent implements OnInit {
	showAutocompleteForm = false;
	color: ThemePalette = null;
	variant: string = null;
	disabled = false;
	selected = false;
	readonly colors: ThemePalette[] = [null, 'warn', 'primary', 'accent'];
	readonly variants: string[] = [null, 'info', 'success', 'warning', 'error'];
	readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

	private stacked = false;
	private readonly tagsCtrl = new FormControl();
	private filteredTags: Observable<string[]>;
	private readonly allTags = ['IT', 'Sales', 'Marketing', 'Management', 'HR', 'Cleaning'];
	private readonly tags = this.allTags.splice(0, 3);

	@ViewChild('tagInput', {static: false}) private readonly tagInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', {static: false}) private readonly matAutocomplete: MatAutocomplete;

	ngOnInit(): void {
		this.color = this.colors[0];
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(
			map((tag: string | null) => tag ? this._filter(tag) : this._remainingTags())
		);
	}

	toggleStacked(): void {
		this.stacked = !this.stacked;
	}

	toggleAutocompleteForm(): void {
		this.showAutocompleteForm = !this.showAutocompleteForm;
	}

	add(event: MatChipInputEvent): void {
		if (!this.matAutocomplete.isOpen) {
			const value = event.value;
			const input = event.input;

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

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
	}

	private _remainingTags() {
		return this.allTags.filter(tag => this.tags.indexOf(tag) < 0);
	}
}
