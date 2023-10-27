import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-off-canvas-example-stackblitz-link-preview',
	templateUrl: './off-canvas-example-stackblitz-link-preview.component.html',
	styleUrls: ['../../../../stackblitz-link.scss'],
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class OffCanvasExampleStackblitzLinkPreviewComponent {}
