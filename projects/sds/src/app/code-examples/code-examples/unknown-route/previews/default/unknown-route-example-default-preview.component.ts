import {Component} from '@angular/core';
import {ObUnknownRouteModule} from '@oblique/oblique';

@Component({
	selector: 'app-unknown-route-example-default-preview',
	templateUrl: './unknown-route-example-default-preview.component.html',
	standalone: true,
	imports: [ObUnknownRouteModule]
})
export class UnknownRouteExampleDefaultPreviewComponent {}
