import {ObButtonModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
	selector: 'sb-example-dialog',
	imports: [MatButtonModule, MatDialogModule, ObButtonModule],
	templateUrl: './example-dialog.component.html',
})
export class ExampleDialogComponent {}
