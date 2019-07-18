import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MultiselectConfig {
	enableAllSelectedText = true;
	dynamicTitleMaxItems = 3;
	enableSearch = false;
	maxHeight = '300px';
	selectionLimit = 0;
	showCheckAll = false;
	showUncheckAll = false;

	private readonly occurrences: {[key: string]: number} = {};

	getUniqueId(id: string) {
		if (!this.occurrences[id]) {
			this.occurrences[id] = 0;
		}

		return id + '_' + this.occurrences[id]++;
	}
}

