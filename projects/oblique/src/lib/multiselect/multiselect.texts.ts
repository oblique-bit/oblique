import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ObMultiselectTexts {
	checkAll = 'i18n.oblique.multiselect.checkAll';
	uncheckAll = 'i18n.oblique.multiselect.uncheckAll';
	checked = 'i18n.oblique.multiselect.checked';
	//TODO: This is currently not used!
	checkedPlural = 'i18n.oblique.multiselect.checkedPlural';
	searchPlaceholder = 'i18n.oblique.multiselect.searchPlaceholder';
	defaultTitle = 'i18n.oblique.multiselect.defaultTitle';
	allSelected = 'i18n.oblique.multiselect.allSelected';
}
