import {MatButtonModule} from '@angular/material/button';
import {Component} from '@angular/core';
import {ObBreadcrumbModule, ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-breadcrumb-example-default-preview',
	imports: [MatButtonModule, ObBreadcrumbModule, ObButtonModule, ObExternalLinkModule],
	templateUrl: './breadcrumb-example-default-preview.component.html'
})
export class BreadcrumbExampleDefaultPreviewComponent {}
