import {Component} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-alert-example-type-preview',
	templateUrl: './alert-example-type-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObAlertModule]
})
export class AlertExampleTypePreviewComponent implements PreviewComponent {}
