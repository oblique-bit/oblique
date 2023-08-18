import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-overlap-false',
	templateUrl: './badge-example-overlap-false.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatBadgeModule]
})
export class BadgeExampleOverlapFalseComponent implements PreviewComponent {}
