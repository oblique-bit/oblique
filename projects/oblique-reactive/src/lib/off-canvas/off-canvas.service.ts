import {EventEmitter, Injectable} from '@angular/core';

/**
 * Service for controlling ObliqueUI offcanvas composite features.
 */
@Injectable()
export class OffCanvasService {
	openEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

	get open(): boolean {
		return this.isOpen;
	}

	set open(value: boolean) {
		this.isOpen = value;
		this.openEmitter.next(this.isOpen);
	}

	private isOpen = false;
}
