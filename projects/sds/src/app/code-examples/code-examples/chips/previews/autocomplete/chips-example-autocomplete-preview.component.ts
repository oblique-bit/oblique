import {ChangeDetectionStrategy, Component, type ElementRef, viewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {type MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule, type MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {type Observable, map, startWith} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';

@Component({
	selector: 'app-chips-example-autocomplete-preview',
	imports: [CommonModule, MatChipsModule, MatAutocompleteModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatListModule],
	templateUrl: './chips-example-autocomplete-preview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsExampleAutocompletePreviewComponent {
	separatorKeysCodes: number[] = [ENTER, COMMA];
	fruitControl = new FormControl('');
	filteredFruits$: Observable<string[]>;
	fruits: string[] = ['Lemon'];
	allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
	readonly fruitInput = viewChild<ElementRef<HTMLInputElement>>('fruitInput');

	constructor() {
		this.filteredFruits$ = this.fruitControl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this.filter(fruit) : this.allFruits.slice()))
		);
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.fruits.push(value);
		}

		// Clear the input value
		event.chipInput?.clear();

		this.fruitControl.setValue(null);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitControl.setValue(null);
		this.fruitInput().nativeElement.value = '';
	}

	private filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
	}
}
