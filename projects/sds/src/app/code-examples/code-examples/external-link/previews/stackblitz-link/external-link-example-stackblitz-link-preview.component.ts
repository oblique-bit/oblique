import {Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-external-link-example-stackblitz-link-preview',
	templateUrl: './external-link-example-stackblitz-link-preview.component.html',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class ExternalLinkExampleStackblitzLinkPreviewComponent {}
