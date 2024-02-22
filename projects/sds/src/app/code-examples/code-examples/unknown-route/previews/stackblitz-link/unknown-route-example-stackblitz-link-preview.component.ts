import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-unknown-route-example-stackblitz-link-preview',
	templateUrl: './unknown-route-example-stackblitz-link-preview.component.html',
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class UnknownRouteExampleStackblitzLinkPreviewComponent {}
