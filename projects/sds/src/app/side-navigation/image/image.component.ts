import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'app-image',
	templateUrl: './image.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {
	@Input() alt = '';
	@Input() maxHeight = '';
	@Input() maxWidth = '';
	@Input() idPrefix = '';
	@Input() src = 'http://www.image-src.com';

	readonly componentId = 'image';
}
