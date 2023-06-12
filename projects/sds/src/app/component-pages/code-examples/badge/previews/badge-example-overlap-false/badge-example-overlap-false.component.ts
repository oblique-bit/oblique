import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
@Component({
	selector: 'app-badge-example-overlap-false',
	templateUrl: './badge-example-overlap-false.component.html',
	styleUrls: ['../shared/badge-code-examples.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeExampleOverlapFalseComponent implements PreviewComponent {}
