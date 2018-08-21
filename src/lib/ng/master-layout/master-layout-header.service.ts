import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ScrollingConfig} from '../scrolling';
import {Unsubscribable} from '../unsubscribe';

/**
 * Service for controlling ObliqueUI header composite features.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Injectable()
export class MasterLayoutHeaderService extends Unsubscribable implements OnInit {

	public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	get open() {
		return this.openValue;
	}

	set open(value) {
		if (this.openValue !== value) {
			this.openChange.next(value);
		}
		this.openValue = value;
	}

	get medium() {
		return this.mediumValue;
	}

	set medium(value) {
		this.mediumValue = value;
		this.variantChange.next(this.mediumValue);
	}

	private openValue = false;
	private mediumValue = false;

	constructor(private readonly config: ScrollingConfig) {
		super();

		if (config.transitions) {
			config.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.medium = isScrolling;
				});
		}
	}

	ngOnInit() {
		console.warn('@deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead');
	}

	public toggle() {
		this.open = !this.open;
	}
}
