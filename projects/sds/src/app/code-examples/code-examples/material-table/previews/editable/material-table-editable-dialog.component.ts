import {Component, Inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObButtonModule} from '@oblique/oblique';
import {PeriodicElement} from './mock-backend.service';

@Component({
	selector: 'app-material-table-editable-dialog',
	templateUrl: './material-table-editable-dialog.component.html',
	imports: [MatDialogModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, ObButtonModule],
	standalone: true
})
export class AppMaterialTableExampleEditableDialogComponent implements OnInit {
	editForm: UntypedFormGroup;

	constructor(
		private readonly formBuilder: UntypedFormBuilder,
		private readonly dialogRef: MatDialogRef<AppMaterialTableExampleEditableDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private readonly data: PeriodicElement
	) {}

	ngOnInit(): void {
		this.editForm = this.buildEditFormGroup(this.formBuilder, this.data ?? ({} as PeriodicElement));
	}

	close(): void {
		this.dialogRef.close();
	}

	save(form: UntypedFormGroup): void {
		if (form.valid) {
			this.dialogRef.close(form.value);
		}
	}

	private buildEditFormGroup(formBuilder: UntypedFormBuilder, element: PeriodicElement): UntypedFormGroup {
		return formBuilder.group({
			id: [element.id],
			name: [element.name, Validators.required],
			position: [element.position, Validators.required],
			weight: [element.weight, Validators.required],
			symbol: [element.symbol, Validators.required]
		});
	}
}
