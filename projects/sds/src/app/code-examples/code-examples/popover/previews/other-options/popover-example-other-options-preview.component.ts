import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObEToggleType, ObPopoverModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-popover-example-other-options-preview',
	templateUrl: './popover-example-other-options-preview.component.html',
	imports: [ObPopoverModule, ObButtonModule, MatButtonModule],
	styleUrls: ['../../../../code-example-flex-layout.scss', './popover-example-other-options-preview.component.scss']
})
export class PopoverExampleOtherOptionsPreviewComponent {
	toggleType: ObEToggleType;
	toggleTypeClick = ObEToggleType.CLICK;
	toggleTypeHover = ObEToggleType.HOVER;
}
