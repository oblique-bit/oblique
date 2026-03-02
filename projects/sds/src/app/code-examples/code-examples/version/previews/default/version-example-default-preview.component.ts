import {Component} from '@angular/core';
import {appVersion} from '@oblique/oblique';

@Component({
	selector: 'app-version-example-default-preview',
	templateUrl: './version-example-default-preview.component.html',
})
export class VersionExampleDefaultPreviewComponent {
	readonly version = appVersion;
}
