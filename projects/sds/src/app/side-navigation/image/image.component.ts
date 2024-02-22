import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
	selector: 'app-image',
	templateUrl: './image.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, NgOptimizedImage]
})
export class ImageComponent {
	@Input({required: true}) height!: number;
	@Input({required: true}) ngSrc!: string;
	@Input({required: true}) width!: number;

	@Input() alt = '';
	@Input() idPrefix = '';

	readonly componentId = 'image';
}
