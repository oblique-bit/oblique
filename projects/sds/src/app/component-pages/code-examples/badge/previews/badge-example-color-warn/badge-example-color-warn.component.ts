import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-color-warn',
	templateUrl: './badge-example-color-warn.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatBadgeModule]
})
export class BadgeExampleColorWarnComponent implements PreviewComponent {}
