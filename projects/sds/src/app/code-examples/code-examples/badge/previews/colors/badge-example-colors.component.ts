import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
	selector: 'app-badge-example-colors',
	imports: [MatBadgeModule],
	templateUrl: './badge-example-colors.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {class: 'layout-breakpoint-md'}
})
export class BadgeExampleColorsComponent {}
