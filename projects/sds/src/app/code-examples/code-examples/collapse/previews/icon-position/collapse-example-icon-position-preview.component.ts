import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObCollapseModule} from '@oblique/oblique';

@Component({
	selector: 'app-collapse-example-icon-position-preview',
	imports: [ObCollapseModule],
	templateUrl: './collapse-example-icon-position-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class CollapseExampleIconPositionPreviewComponent {}
