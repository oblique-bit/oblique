import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-position-below-before',
	templateUrl: './badge-example-position-below-before.component.html',
	styleUrls: ['../shared/badge-code-examples.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule, MatBadgeModule]
})
export class BadgeExamplePositionBelowBeforeComponent implements PreviewComponent {}
