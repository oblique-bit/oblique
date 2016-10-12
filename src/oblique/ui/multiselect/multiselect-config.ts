export class MultiselectConfig {
	extraSettings = {
		idProp: 'id',
		displayProp: 'label',
		externalIdProp: '', // Return the full item model when selected
		scrollable: false,
		showCheckAll: true,
		showUncheckAll: true,
		smartButtonMaxItems: 1000 // FIXME: that's a hack...
	};
	translationTexts = {
		checkAll: 'multiselect.checkAll',
		uncheckAll: 'multiselect.uncheckAll',
		buttonDefaultText: 'multiselect.buttonDefault',
		allSelectedText: 'multiselect.allSelected'
	};
}
