import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-nav-tree-example-filter-preview',
	templateUrl: './nav-tree-example-filter-preview.component.html',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class NavTreeExampleFilterPreviewComponent {}
