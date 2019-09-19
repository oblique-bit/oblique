import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
	animal: string;
	name: string;
}

@Component({
	selector: 'or-example-dialog',
	templateUrl: './example-dialog.component.html'
})
export class ExampleDialogComponent {

	constructor(
		public dialogRef: MatDialogRef<ExampleDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) {
	}

	onCancel(): void {
		this.dialogRef.close();
	}

}
