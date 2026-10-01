import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-nav-tree-example-expand-collapse-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './nav-tree-example-expand-collapse-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavTreeExampleExpandCollapsePreviewComponent {}
