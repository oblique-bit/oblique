import {Component} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-alert-example-info-preview',
	templateUrl: './alert-example-info-preview.component.html',
	standalone: true,
	imports: [ObAlertModule]
})
export class AlertExampleInfoPreviewComponent implements PreviewComponent {}
