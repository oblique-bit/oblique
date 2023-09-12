import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-colors',
	templateUrl: './badge-example-colors.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatBadgeModule],
	host: {class: 'layout-breakpoint-md'}
})
export class BadgeExampleColorsComponent implements PreviewComponent {}
