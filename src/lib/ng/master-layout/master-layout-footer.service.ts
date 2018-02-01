import {Injectable, EventEmitter} from '@angular/core';

/**
 * Service for controlling ObliqueUI footer composite features.
 */
@Injectable()
export class MasterLayoutFooterService {

	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	private smallValue = false;

	set small(value) {
		this.smallValue = value;
		this.variantChange.next(this.smallValue);
	}

	get small() {
		return this.smallValue;
	}
}
