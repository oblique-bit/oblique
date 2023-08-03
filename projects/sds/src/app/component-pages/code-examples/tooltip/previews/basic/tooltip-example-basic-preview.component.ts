import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'app-tooltip-example-basic-preview',
	templateUrl: './tooltip-example-basic-preview.component.html',
	standalone: true,
	imports: [MatButtonModule, ObButtonModule, MatTooltipModule]
})
export class TooltipExampleBasicPreviewComponent implements PreviewComponent {}
