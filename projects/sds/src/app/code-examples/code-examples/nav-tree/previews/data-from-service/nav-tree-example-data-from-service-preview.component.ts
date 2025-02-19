import {Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-nav-tree-example-data-from-service-preview',
	templateUrl: './nav-tree-example-data-from-service-preview.component.html',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class NavTreeExampleDataFromServicePreviewComponent {}
