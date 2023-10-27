import {Component, inject} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ExampleDialogSpinnerComponent} from './example-dialog-spinner/example-dialog-spinner.component';
import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	standalone: true,
	imports: [MatButtonModule, MatDialogModule, ObButtonModule],
	selector: 'app-dialog-example-spinner',
	templateUrl: './dialog-example-spinner.component.html'
})
export class DialogExampleSpinnerComponent {
	private readonly dialog = inject(MatDialog);

	openDialog(): void {
		this.dialog.open(ExampleDialogSpinnerComponent);
	}
}
