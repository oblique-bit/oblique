import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-off-canvas-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './off-canvas-example-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
})
export class OffCanvasExampleStackblitzLinkPreviewComponent {}
