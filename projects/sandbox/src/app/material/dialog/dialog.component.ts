import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ExampleDialogComponent} from './example-dialog/example-dialog.component';

@Component({
	selector: 'sb-dialog',
	templateUrl: './dialog.component.html'
})
export class DialogComponent {
	spinner = 'none';
	name: string;
	animal: string;
	dialogState: string;

	private readonly DIALOG_STATE_NEVER_OPENED = 'Never opened';
	private readonly DIALOG_STATE_OPEN = 'Open';
	private readonly DIALOG_STATE_CLOSED = 'Closed';
	private readonly DIALOG_WIDTH = '250px';

	constructor(public dialog: MatDialog) {
		this.dialogState = this.DIALOG_STATE_NEVER_OPENED;
	}

	openDialog(): void {
		this.dialogState = this.DIALOG_STATE_OPEN;
		const dialogRef = this.dialog.open(ExampleDialogComponent, {
			width: this.DIALOG_WIDTH,
			data: {name: this.name, animal: this.animal, spinner: this.spinner}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.dialogState = this.DIALOG_STATE_CLOSED;
			this.animal = result;
		});
	}
}
