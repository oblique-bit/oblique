import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-badge-example-other-options',
	imports: [MatBadgeModule, MatButtonModule, ObButtonModule],
	templateUrl: './badge-example-other-options.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {class: 'layout-breakpoint-md'},
})
export class BadgeExampleOtherOptionsComponent {}
