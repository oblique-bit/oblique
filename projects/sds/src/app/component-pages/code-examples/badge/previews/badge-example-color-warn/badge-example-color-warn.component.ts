import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-color-warn',
	templateUrl: './badge-example-color-warn.component.html',
	styleUrls: ['../shared/badge-code-examples.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeExampleColorWarnComponent implements PreviewComponent {}
