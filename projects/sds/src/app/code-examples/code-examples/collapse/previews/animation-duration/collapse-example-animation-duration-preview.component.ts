import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObCollapseModule} from '@oblique/oblique';

@Component({
	selector: 'app-collapse-example-animation-duration-preview',
	imports: [ObCollapseModule],
	templateUrl: './collapse-example-animation-duration-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class CollapseExampleAnimationDurationPreviewComponent {}
