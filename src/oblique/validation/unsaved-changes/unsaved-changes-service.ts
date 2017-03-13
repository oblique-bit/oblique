import {LoadingService} from '../../status/loading-service';

export class UnsavedChangesService {

	/**
	 * The collection of forms being watched.
	 */
	forms = [];
	modal = {
		forms: [],
		isOpened: false,
		isModal: false
	};

	/*@ngInject*/
	constructor(public $rootScope: ng.IRootScopeService,
	            public $timeout: ng.ITimeoutService,
	            public $translate: ng.translate.ITranslateService,
	            public $window: ng.IWindowService,
	            private loadingService: LoadingService) {

		// Event called each time that there is a state change
		let deregister = $rootScope.$on('$stateChangeStart', (event) => {
			if (this.modal.isModal) {
				if (!this.modal.isOpened)
					this.modal.isModal = false;
				return;
			}
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
	 * Checks if any non-modal form from the watched collection is dirty.
	 *
	 * @returns {boolean}
	 */
	isDirty() {
		return this.isAnyFormDirty(this.forms);
	}

	/**
	 * Checks if any modal form from the watched collection is dirty.
	 *
	 * @returns {boolean}
	 */
	isModalDirty() {
		return this.isAnyFormDirty(this.modal.forms);
	}

	/**
	 * Registers the provided form in order to be watched for any pending changes.
	 *
	 * @param form
	 */
	watch(form, isModal: boolean) {
		if (isModal)
			this.modal.forms.push(form);
		else
			this.forms.push(form);
	};


	/**
	 * Checks if unsaved changes are pending on the whole collection of non modal watched forms
	 * or only on the nested form if `nestedForm` is specified.
	 *
	 * If unsaved changes are pending, let's display the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @see confirm()
	 *
	 * @param nestedForm
	 * @returns {boolean} true if there is no changes or the user has confirmed that he wants to lose the changes
	 */
	check(nestedForm?) {
		return (nestedForm ? !nestedForm.$dirty : !this.isDirty()) || this.confirm();
	};

	/**
	 * Checks if unsaved changes are pending on the whole collection of modal watched forms.
	 *
	 * If unsaved changes are pending, let's display the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @see confirm()
	 *
	 * @returns {boolean} true if there is no changes or the user has confirmed that he wants to lose the changes
	 */
	checkModal() {
		return !this.isModalDirty() || this.confirm();
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
		return this.$translate.instant('i18n.validation.unsavedChanges');
	}

	/**
	 * Remove all forms being watched for modification.
 	 */
	clear() {
		this.forms.length = 0;
	}

	/**
	 * Checks if unsaved changes are pending on the whole collection of modal watched forms.
	 *
	 * If unsaved changes are pending, let's display the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @see checkModal() and confirm()
	 *
	 * @param event
	 */
	modalClosing(event): void {
		if (!this.checkModal()) {
			event.preventDefault();
		} else {
			this.modal.isOpened = false;
			this.modal.forms.length = 0;
		}
	}


	/**
	 * Checks if unsaved changes are pending on the whole collection of non-modal watched forms.
	 *
	 * If unsaved changes are pending, let's display the *browser-native* confirmation dialog,
	 * as this is the only way to prevent user from leaving the current browser tab.
	 *
	 * @see check() and confirm()
	 *
	 * @param event
	 */
	modalOpening(event): boolean {
		this.modal.isModal = true;
		this.modal.isOpened = true;
		if (!this.check()) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	private isAnyFormDirty(forms): boolean {
		let dirty = false;
		angular.forEach(forms, (form) => {
			dirty = dirty || form.$dirty;
		});
		return dirty;
	}
}
