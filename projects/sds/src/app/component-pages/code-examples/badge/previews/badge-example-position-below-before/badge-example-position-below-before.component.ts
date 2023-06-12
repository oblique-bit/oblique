import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-position-below-before',
	templateUrl: './badge-example-position-below-before.component.html',
	styleUrls: ['../shared/badge-code-examples.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeExamplePositionBelowBeforeComponent implements PreviewComponent {}
