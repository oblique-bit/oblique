import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-popover12-example-default-preview',
	templateUrl: './popover12-example-default-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './popover12-example-default-preview.component.scss'],
	standalone: true,
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule]
})
export class Popover12ExampleDefaultPreviewComponent {}
