import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {IdPipe} from '../../shared/id/id.pipe';
import {NgOptimizedImage} from '@angular/common';

@Component({
	selector: 'app-image',
	templateUrl: './image.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IdPipe, NgOptimizedImage]
})
export class ImageComponent {
	readonly height = input.required<number>();
	readonly ngSrc = input.required<string>();
	readonly width = input.required<number>();

	readonly alt = input('');
	readonly idPrefix = input('');

	readonly componentId = 'image';
}
