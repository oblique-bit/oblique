import {LoadingService} from 'oblique-reactive/oblique';

export class UnsavedChangesService {

	/**
	 * The collection of forms being watched.
	 */
	forms = [];

	/*@ngInject*/
	constructor(public $rootScope: ng.IRootScopeService,
	            public $timeout: ng.ITimeoutService,
	            public $translate: ng.translate.ITranslateService,
	            public $window: ng.IWindowService,
	            private loadingService: LoadingService) {

		// Event called each time that there is a state change
		let deregister = $rootScope.$on('$stateChangeStart', (event) => {
			// Check if there is any dirty form
			if (this.isDirty()) {
				// Show a warning message to the user:
				if (!this.confirm()) {
					// The user selected the "Cancel" option, so we stop the loading of the next state:
					loadingService.loading.active = false; // FIXME: use loadingService.stop() instead?
					event.preventDefault();
				} else {
					$rootScope.$broadcast('discardUnsavedChangesEvent');
					// The user wants to discard the changes, so we don't prevent the default behavior of the event
					// We stop tracking the changes on the forms:
					this.clear();
				}
			} else {
				// No form were dirty and we stop tracking the changes on the forms:
				this.clear();
			}
		});

		// Event called each time an external link is opened or the browser window is closed
		$(window).bind('beforeunload.unsaved-changes', (e: JQueryEventObject) => {
			if (this.isDirty()) {
				// If any form is dirty, we display the warning message.
				// The browser will propose the buttons OK/Cancel
				return this.message();
			}
		});

		$rootScope.$on('$destroy', () => {
			deregister();
			$(window).off('beforeunload.unsaved-changes');
		})
	}

	/**
	 * Checks if any form from the watched collection is dirty.
	 *
	 * @returns {boolean}
	 */
	isDirty() {
		let dirty = false;
		angular.forEach(this.forms, (form) => {
			dirty = dirty || form.$dirty;
		});
		return dirty;
	}

	/**
	 * Registers the provided form in order to be watched for any pending changes.
	 *
	 * @param form
	 */
	watch(form) {
		this.forms.push(form);
	};


	/**
	 * Checks if unsaved changes are pending on the whole collection of watched
	 * or only on the nested form if `subForm` is specified.
	 *
	 * If unsaved changes are pending, let's display the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @see confirm()
	 *
	 * @param nestedForm
	 * @returns {boolean} true if there is no changes or the user has confirmed that he wants to lose the changes
	 */
	check(nestedForm) {
		return (nestedForm ? !nestedForm.$dirty : !this.isDirty()) || this.confirm();
	};

	/**
	 * Displays the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @returns {boolean}
	 */
	confirm() {
		return this.$window.confirm(this.message());
	};

	/**
	 * Retrieves the default error message to display.
	 *
	 * @returns {string}
	 */
	message() {
		return this.$translate.instant('i18n.common.unsavedChanges');
	}

	/**
	 * Remove all forms being watched for modification.
 	 */
	clear() {
		this.forms.length = 0;
	}
}
