import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-popover-example-default-preview',
	templateUrl: './popover-example-default-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './popover-example-default-preview.component.scss'],
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule]
})
export class PopoverExampleDefaultPreviewComponent {}
