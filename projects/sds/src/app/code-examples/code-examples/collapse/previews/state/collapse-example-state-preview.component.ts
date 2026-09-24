import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObCollapseModule} from '@oblique/oblique';

@Component({
	selector: 'app-collapse-example-state-preview',
	imports: [ObCollapseModule],
	templateUrl: './collapse-example-state-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class CollapseExampleStatePreviewComponent {}
