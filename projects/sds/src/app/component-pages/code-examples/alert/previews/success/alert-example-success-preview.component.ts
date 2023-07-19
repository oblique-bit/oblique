import {Component} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-alert-example-success-preview',
	templateUrl: './alert-example-success-preview.component.html',
	standalone: true,
	imports: [ObAlertModule]
})
export class AlertExampleSuccessPreviewComponent implements PreviewComponent {}
