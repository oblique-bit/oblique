import {ObButtonModule} from '@oblique/oblique';
import {Component, inject} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ExampleDialogComponent} from './example-dialog/example-dialog.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
	standalone: true,
	imports: [MatButtonModule, MatDialogModule, ObButtonModule],
	selector: 'app-dialog-example-default',
	templateUrl: './dialog-example-default.component.html'
})
export class DialogExampleDefaultComponent {
	private readonly dialog = inject(MatDialog);

	openDialog(): void {
		this.dialog.open(ExampleDialogComponent);
	}
}
