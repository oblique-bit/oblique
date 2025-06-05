import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObSelectableModule} from '@oblique/oblique';
import {JsonPipe} from '@angular/common';

@Component({
	selector: 'app-selectable-example-in-a-form-preview',
	templateUrl: './selectable-example-in-a-form-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
	imports: [ObSelectableModule, ReactiveFormsModule, JsonPipe]
})
export class SelectableExampleInAFormPreviewComponent implements OnInit {
	sampleForm: FormGroup;
	private readonly formBuilder = inject(FormBuilder);

	ngOnInit(): void {
		this.sampleForm = this.formBuilder.group({
			sampleCreatures: [[], Validators.required]
		});
	}
}
