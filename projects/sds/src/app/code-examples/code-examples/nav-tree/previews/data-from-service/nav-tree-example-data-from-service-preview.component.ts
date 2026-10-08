import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-nav-tree-example-data-from-service-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './nav-tree-example-data-from-service-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavTreeExampleDataFromServicePreviewComponent {}
