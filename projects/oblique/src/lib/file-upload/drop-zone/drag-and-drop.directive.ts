import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
	selector: '[obDragDrop]',
	standalone: true,
	host: {
		'(dragleave)': 'onDragLeave($event)',
		'(dragover)': 'onDragOver($event)',
		'(drop)': 'ondrop($event)',
		'[class.ob-dragging]': 'isDragging',
	},
})
export class ObDragDropDirective {
	@Output() readonly fileDropped = new EventEmitter<FileList>();
	protected isDragging = false;

	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = true;
	}

	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = false;
	}

	public ondrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const {files} = event.dataTransfer;
		if (files.length) {
			this.fileDropped.emit(files);
			this.isDragging = false;
		}
	}
}
