import {Directive, output, signal} from '@angular/core';

@Directive({
	selector: '[obDragDrop]',
	host: {
		'(dragleave)': 'onDragLeave($event)',
		'(dragover)': 'onDragOver($event)',
		'(drop)': 'ondrop($event)',
		'[class.ob-dragging]': 'isDragging()',
	},
})
export class ObDragDropDirective {
	readonly fileDropped = output<FileList>();
	protected readonly isDragging = signal(false);

	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging.set(true);
	}

	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging.set(false);
	}

	public ondrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const {files} = event.dataTransfer;
		if (files.length) {
			this.fileDropped.emit(files);
			this.isDragging.set(false);
		}
	}
}
