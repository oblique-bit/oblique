import {Component} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-tooltip-example-position-preview',
	templateUrl: './tooltip-example-position-preview.component.html',
	styleUrls: ['./tooltip-example-position-preview.component.scss'],
	standalone: true,
	imports: [MatTooltipModule, MatButtonModule, ObButtonModule, ObExternalLinkModule]
})
export class TooltipExamplePositionPreviewComponent implements PreviewComponent {}
