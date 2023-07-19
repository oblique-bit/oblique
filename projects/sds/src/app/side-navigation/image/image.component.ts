import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-image',
	templateUrl: './image.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe]
})
export class ImageComponent {
	@Input() alt = '';
	@Input() maxHeight = '';
	@Input() maxWidth = '';
	@Input() idPrefix = '';
	@Input() src = 'http://www.image-src.com';

	readonly componentId = 'image';
}
