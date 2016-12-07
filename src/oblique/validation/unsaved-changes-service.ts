import {LoadingService} from 'oblique-reactive/oblique';

export class UnsavedChangesService {

	// The array of forms being tracked
	watchedForms = [];
	watchedFormsForTab = [];

	/*@ngInject*/
	constructor(public $rootScope: ng.IRootScopeService,
	            public $timeout: ng.ITimeoutService,
	            public $translate: ng.translate.ITranslateService,
	            public $window: ng.IWindowService,
	            private loadingService: LoadingService) {

		// Event called each time that there is a state change
		$rootScope.$on('$stateChangeStart', (event) => {
			// Check if there is any dirty form
			if (this.isDirty()) {
				// Show a warning message to the user
				if (!$window.confirm(this.errorMessage())) {
					// The user selected the "Cancel" option, so we stop the loading of the next state:
					loadingService.loading = false;
					event.preventDefault();
				} else {
					$rootScope.$broadcast('discardChangesEvent');
					// The user wants to discard the changes, so we don't prevent the default behavior of the event
					// We stop tracking the changes on the forms
					this.clear();
				}
			} else {
				// No form were dirty and we stop tracking the changes on the forms:
				this.clear();
			}
		});

		// Event called each time an external link is opened or the browser window is closed
		$(window).bind('beforeunload.unsaved-changes', (e:JQueryEventObject) => {
			// If any form is dirty, we display the warning message. The browser will propose the buttons OK/Cancel
			if (this.isDirty()) {
				let message = this.errorMessage();
				//e.returnValue = message;
				return message;
			}
		});

		$rootScope.$on('$destroy', () => {
			console.log('$destroy');
			$(window).off('beforeunload.unsaved-changes');
		})
	}

	errorMessage() {
		return this.$translate.instant('common.unsavedChangesMessage');
	}

	// Check if any form from the list is dirty
	isDirty(formArray: any = null) {
		let forms = formArray ? formArray : this.watchedForms;
		// TODO: improve this
		for (let i = 0; i < forms.length; i++) {
			if (forms[i].$dirty) {
				return true;
			}
		}
		return false;
	}

	// Watch the form for any pending changes
	watchForm (form, activateForTabChange) {
		this.watchedForms.push(form);
		if (activateForTabChange) {
			this.watchedFormsForTab.push(form);
		}
	};

	// Check if any unsaved changes are pending, if so, display the confirm message
	// It returns true if there is no changes or the user has confirmed that he wants to lose the changes
	check() {
		return !this.isDirty() || this.$window.confirm(this.errorMessage());
	};

	// Check if any unsaved changes are pending during the tab switch, if so, display the confirm message
	// It returns true if there is no changes or the user has confirmed that he wants to lose the changes
	checkTab() { // TODO: still used?
		if (!this.isDirty(this.watchedFormsForTab) || this.$window.confirm(this.errorMessage())) {
			this.watchedFormsForTab = [];
			return true;
		}
		return false;
	}

	// Remove all forms being watched for modification
	clear() {
		this.watchedForms = [];
		this.watchedFormsForTab = [];
	}
}
