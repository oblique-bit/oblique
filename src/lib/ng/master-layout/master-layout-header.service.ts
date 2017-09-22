import {Injectable, EventEmitter} from '@angular/core';

import {ScrollingConfig} from '../scrolling/scrolling-config';

/**
 * Service for controlling ObliqueUI header composite features.
 */
@Injectable()
export class MasterLayoutHeaderService {

	private openValue = false;
	private mediumValue = false;

	public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private config: ScrollingConfig) {

		if (config.transitions) {
			config.onScroll.subscribe((isScrolling) => {
				this.medium = isScrolling;
			});
		}
	}

	set open(value) {
		if (this.openValue !== value) {
			this.openChange.next(value);
		}
		this.openValue = value;
	}

	get open() {
		return this.openValue;
	}

	set medium(value) {
		this.mediumValue = value;
		this.variantChange.next(this.mediumValue);
	}

	get medium() {
		return this.mediumValue;
	}
}
