import {Injectable, EventEmitter} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ScrollingConfig} from '../scrolling';
import {Unsubscribable} from '../unsubscribe';

/**
 * Service for controlling ObliqueUI header composite features.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Injectable()
export class MasterLayoutHeaderService extends Unsubscribable {

	public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	private openValue = false;
	private mediumValue = false;

	constructor(private readonly config: ScrollingConfig) {
		super();
		console.warn('@deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead');

		if (config.transitions) {
			config.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.medium = isScrolling;
				});
		}
	}

	public toggle() {
		this.open = !this.open;
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
