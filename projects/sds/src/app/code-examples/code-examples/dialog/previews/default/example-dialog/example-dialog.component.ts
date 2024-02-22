import {ObButtonModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
	standalone: true,
	imports: [MatButtonModule, MatDialogModule, ObButtonModule],
	selector: 'sb-example-dialog',
	templateUrl: './example-dialog.component.html'
})
export class ExampleDialogComponent {}
