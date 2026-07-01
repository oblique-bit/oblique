import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObCollapseModule} from '@oblique/oblique';

@Component({
	selector: 'app-collapse-example-default-preview',
	imports: [ObCollapseModule],
	templateUrl: './collapse-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class CollapseExampleDefaultPreviewComponent {}
