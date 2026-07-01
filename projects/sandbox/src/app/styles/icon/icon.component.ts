import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObEIcon} from '@oblique/oblique';

@Component({
	selector: 'sb-icon-sample',
	standalone: false,
	templateUrl: './icon.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class IconSampleComponent {
	icons = Object.values(ObEIcon);
}
