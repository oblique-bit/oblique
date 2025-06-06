import {Component} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-tooltip-example-position-preview',
	templateUrl: './tooltip-example-position-preview.component.html',
	styleUrl: './tooltip-example-position-preview.component.scss',
	imports: [MatTooltipModule, MatButtonModule, ObButtonModule, ObExternalLinkModule]
})
export class TooltipExamplePositionPreviewComponent {}
