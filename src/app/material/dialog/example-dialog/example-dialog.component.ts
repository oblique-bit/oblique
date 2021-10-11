import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ObSpinnerService} from '@oblique/oblique';
import {ObIDialogData} from '../dialog.model';

@Component({
	selector: 'ob-example-dialog',
	templateUrl: './example-dialog.component.html'
})
export class ObExampleDialogComponent {
	constructor(public dialogRef: MatDialogRef<ObExampleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ObIDialogData, spinner: ObSpinnerService) {
		spinner.activate();
		setTimeout(() => spinner.deactivate(), 2000);
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
