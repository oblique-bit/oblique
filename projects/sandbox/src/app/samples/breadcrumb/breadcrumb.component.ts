import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-breadcrumb-sample',
	standalone: false,
	templateUrl: './breadcrumb.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class BreadcrumbSampleComponent {}
