import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-popover-example-default-preview',
	templateUrl: './popover-example-default-preview.component.html',
	standalone: true,
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule]
})
export class PopoverExampleDefaultPreviewComponent {}
