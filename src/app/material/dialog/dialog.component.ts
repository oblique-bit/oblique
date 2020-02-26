import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ObExampleDialogComponent} from './example-dialog/example-dialog.component';

@Component({
	selector: 'ob-dialog',
	templateUrl: './dialog.component.html'
})
export class ObDialogComponent {
	name: string;
	animal: string;
	dialogState: string;

	private readonly DIALOG_STATE_NEVER_OPENED = 'Never opened';
	private readonly DIALOG_STATE_CURRENTLY_OPEN = 'Currently open';
	private readonly DIALOG_STATE_CLOSED = 'Closed';
	private readonly DIALOG_WIDTH = '250px';

	constructor(public dialog: MatDialog) {
		this.dialogState = this.DIALOG_STATE_NEVER_OPENED;
	}

	openDialog() {
		this.dialogState = this.DIALOG_STATE_CURRENTLY_OPEN;
		const dialogRef = this.dialog.open(ObExampleDialogComponent, {
			width: this.DIALOG_WIDTH,
			data: {name: this.name, animal: this.animal},
		});

		dialogRef.afterClosed().subscribe(result => {
			this.dialogState = this.DIALOG_STATE_CLOSED;
			this.animal = result;
		});
	}
}
