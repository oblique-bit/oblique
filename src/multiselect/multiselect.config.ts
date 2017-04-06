import {Injectable} from '@angular/core';

@Injectable()
export class MultiselectConfig {
    autoUnselect = false;
    checkedStyle: CheckedStyle = 'checkboxes';
    displayAllSelectedText = false;
    dynamicTitleMaxItems = 3;
    enableSearch = false;
    maxHeight = '300px';
    pullRight = false;
    selectionLimit = 0;
    showCheckAll = false;
    showUncheckAll = false;
}

export type CheckedStyle =  'checkboxes' | 'fontawesome';
