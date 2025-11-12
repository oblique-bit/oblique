import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'app-tooltip-example-basic-preview',
	imports: [MatButtonModule, ObButtonModule, MatTooltipModule],
	templateUrl: './tooltip-example-basic-preview.component.html',
})
export class TooltipExampleBasicPreviewComponent {}
