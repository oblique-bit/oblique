import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Service for controlling ObliqueUI offcanvas composite features.
 */
@Injectable({ providedIn: 'root' })
export class OffCanvasService {
	openEmitter: Subject<boolean> = new Subject();

	get open(): boolean {
		return this.isOpen;
	}

	set open(value: boolean) {
		this.isOpen = value;
		this.openEmitter.next(this.isOpen);
	}

	private isOpen = false;
}
