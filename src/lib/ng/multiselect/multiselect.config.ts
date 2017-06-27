import {Injectable} from '@angular/core';

@Injectable()
export class MultiselectConfig {
	enableAllSelectedText? = true;
	dynamicTitleMaxItems? = 3;
	enableSearch? = false;
	maxHeight? = '300px';
	pullRight? = false;
	selectionLimit? = 0;
	showCheckAll? = false;
	showUncheckAll? = false;
}

