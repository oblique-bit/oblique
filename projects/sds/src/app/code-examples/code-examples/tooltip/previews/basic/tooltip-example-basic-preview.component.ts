import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'app-tooltip-example-basic-preview',
	templateUrl: './tooltip-example-basic-preview.component.html',
	imports: [MatButtonModule, ObButtonModule, MatTooltipModule]
})
export class TooltipExampleBasicPreviewComponent {}
