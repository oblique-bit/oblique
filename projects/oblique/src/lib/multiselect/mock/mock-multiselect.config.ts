import {Injectable} from '@angular/core';

@Injectable()
export class ObMockMultiselectConfig {
	enableAllSelectedText = true;
	dynamicTitleMaxItems = 3;
	enableSearch = false;
	maxHeight = '300px';
	selectionLimit = 0;
	showCheckAll = false;
	showUncheckAll = false;

	private readonly ids: string[] = [];

	isIdUnique(id: string): void {
	}

	clearId(id: string): void {
	}
}

