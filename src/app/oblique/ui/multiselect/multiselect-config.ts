export class MultiselectConfig {
    extraSettings = {
        buttonClasses: 'btn btn-default',
        idProp: 'id',
        displayProp: 'label',
        externalIdProp: '', // Return the full item model when selected
        scrollable: false,
        showCheckAll: false,
        showUncheckAll: false,
        // TODO fixme that's a hack
        smartButtonMaxItems: 1000
    };
    translationTexts = {
        checkAll: 'multiselect.checkAll',
        uncheckAll: 'multiselect.uncheckAll',
        buttonDefaultText: 'multiselect.buttonDefaultText'
    };
}