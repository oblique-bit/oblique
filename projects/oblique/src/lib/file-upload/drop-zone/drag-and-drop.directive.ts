import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[obDragDrop]'
})
export class ObDragDropDirective {
	@Output() onFileDropped = new EventEmitter<any>();
	@HostBinding('class.ob-dragging') private isDragging = false;

	@HostListener('dragover', ['$event'])
	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = true;
	}

	@HostListener('dragleave', ['$event'])
	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = false;
	}

	@HostListener('drop', ['$event'])
	public ondrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const files = event.dataTransfer.files;
		if (files.length) {
			this.onFileDropped.emit(files);
			this.isDragging = false;
		}
	}
}
