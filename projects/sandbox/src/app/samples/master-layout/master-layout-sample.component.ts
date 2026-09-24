import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ObEScrollMode} from '@oblique/oblique';

@Component({
	selector: 'sb-master-layout-sample',
	standalone: false,
	templateUrl: './master-layout-sample.component.html',
	styleUrl: './master-layout-sample.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MasterLayoutSampleComponent {
	scrollMode = ObEScrollMode;
	readonly showScrollFixture = signal(false);
	coverLayout = false;

	setLayout($event: boolean): void {
		this.coverLayout = $event;
	}
}
