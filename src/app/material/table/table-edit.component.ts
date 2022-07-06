import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

interface Data {
	position: number;
	name: string;
	weight: number;
	symbol: string;
}

@Component({
	selector: 'sc-table-edit',
	templateUrl: './table-edit.component.html'
})
export class TableEditComponent implements OnInit {
	editForm: UntypedFormGroup;
	isNewRow = false;

	constructor(
		private readonly formBuilder: UntypedFormBuilder,
		private readonly dialogRef: MatDialogRef<TableEditComponent>,
		@Inject(MAT_DIALOG_DATA) private readonly data: Data
	) {}

	ngOnInit(): void {
		this.editForm = TableEditComponent.buildEditFormGroup(this.formBuilder, this.data ?? ({} as Data));
		this.isNewRow = this.data === null;
	}

	close(): void {
		this.dialogRef.close();
	}

	reset(): void {
		// to let Angular reset the values after the browser does it
		setTimeout(() => this.editForm.reset(this.data));
	}

	save(form: UntypedFormGroup): void {
		if (form.valid) {
			this.dialogRef.close(form.value);
		}
	}

	private static buildEditFormGroup(formBuilder: UntypedFormBuilder, data: Data): UntypedFormGroup {
		return formBuilder.group({
			position: [data.position, Validators.required],
			name: [data.name, Validators.required],
			weight: [data.weight, Validators.required],
			symbol: [data.symbol, Validators.required]
		});
	}
}
