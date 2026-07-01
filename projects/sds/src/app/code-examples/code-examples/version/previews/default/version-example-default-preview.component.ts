import {ChangeDetectionStrategy, Component} from '@angular/core';
import {appVersion} from '@oblique/oblique';

@Component({
	selector: 'app-version-example-default-preview',
	templateUrl: './version-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class VersionExampleDefaultPreviewComponent {
	readonly version = appVersion;
}
