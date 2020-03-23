import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ObMultiselectConfig {
	enableAllSelectedText = true;
	dynamicTitleMaxItems = 3;
	enableSearch = false;
	maxHeight = '300px';
	selectionLimit = 0;
	showCheckAll = false;
	showUncheckAll = false;

	private readonly ids: string[] = [];

	isIdUnique(id: string): void {
		if (this.ids.indexOf(id) > -1) {
			throw new Error(id === 'multiselect'
				? 'There cannot be multiple multiselects without explicit ID\'s. Please add a unique id attribute on each multiselect element.'
				: `ID\'s have to be unique, "${id}" has been defined twice`);
		}
		this.ids.push(id);
	}

	clearId(id: string): void {
		this.ids.splice(this.ids.indexOf(id), 1);
	}
}

