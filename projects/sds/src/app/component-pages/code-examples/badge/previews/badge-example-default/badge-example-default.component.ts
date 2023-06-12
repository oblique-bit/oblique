import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-default',
	templateUrl: './badge-example-default.component.html',
	styleUrls: ['../shared/badge-code-examples.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeExampleDefaultComponent implements PreviewComponent {}
