import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObBreadcrumbModule, ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-breadcrumb-example-default-preview',
	imports: [MatButtonModule, ObBreadcrumbModule, ObButtonModule, ObExternalLinkModule, StackblitzLinkComponent],
	templateUrl: './breadcrumb-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class BreadcrumbExampleDefaultPreviewComponent {}
