import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[obDragDrop]'
})
export class ObDragDropDirective {
	// eslint-disable-next-line  @angular-eslint/no-output-on-prefix
	@Output() readonly onFileDropped = new EventEmitter<any>();
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
		const {files} = event.dataTransfer;
		if (files.length) {
			this.onFileDropped.emit(files);
			this.isDragging = false;
		}
	}
}
