import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-badge-example-other-options',
	templateUrl: './badge-example-other-options.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatBadgeModule, MatButtonModule, ObButtonModule],
	host: {class: 'layout-breakpoint-md'}
})
export class BadgeExampleOtherOptionsComponent implements PreviewComponent {}
