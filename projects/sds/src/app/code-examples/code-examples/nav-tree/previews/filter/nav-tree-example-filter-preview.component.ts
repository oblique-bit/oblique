import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-nav-tree-example-filter-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './nav-tree-example-filter-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavTreeExampleFilterPreviewComponent {}
