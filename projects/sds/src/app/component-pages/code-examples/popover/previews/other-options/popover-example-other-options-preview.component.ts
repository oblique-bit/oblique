import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObEToggleType, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-popover-example-other-options-preview',
	templateUrl: './popover-example-other-options-preview.component.html',
	standalone: true,
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule],
	styleUrls: ['../../../../code-example-flex-layout.scss', './popover-example-other-options-preview.component.scss']
})
export class PopoverExampleOtherOptionsPreviewComponent implements PreviewComponent {
	toggleType: ObEToggleType;
	toggleTypeClick = ObEToggleType.CLICK;
	toggleTypeHover = ObEToggleType.HOVER;
}
