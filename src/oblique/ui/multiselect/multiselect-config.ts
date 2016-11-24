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
		checkAll: 'i18n.multiselect.checkAll',
		uncheckAll: 'i18n.multiselect.uncheckAll',
		buttonDefaultText: 'i18n.multiselect.buttonDefault',
		allSelectedText: 'i18n.multiselect.allSelected'
	};
}
