import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObPopoverModule} from '@oblique/oblique';
import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'app-popover-example-default-preview',
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule],
	templateUrl: './popover-example-default-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './popover-example-default-preview.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class PopoverExampleDefaultPreviewComponent {}
