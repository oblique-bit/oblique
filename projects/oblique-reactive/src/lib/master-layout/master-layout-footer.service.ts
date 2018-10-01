import {Injectable, EventEmitter, OnInit} from '@angular/core';

/**
 * Service for controlling ObliqueUI footer composite features.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Injectable()
export class MasterLayoutFooterService implements OnInit {

	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	private smallValue = false;

	set small(value) {
		this.smallValue = value;
		this.variantChange.next(this.smallValue);
	}

	get small() {
		return this.smallValue;
	}

	ngOnInit() {
		console.warn('MasterLayoutFooterService is deprecated since version 2.1.0 and will be deleted in version 3.0.0. ' +
			'Use MasterLayoutComponent & MasterLayoutService instead');
	}
}
