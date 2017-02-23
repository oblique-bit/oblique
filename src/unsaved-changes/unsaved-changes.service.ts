import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from 'ng2-translate';
import 'rxjs/add/operator/filter';

@Injectable()
export class UnsavedChangesService {
    private forms: ControlContainer[] = [];

    constructor(private translateService: TranslateService) {
        window.addEventListener('beforeunload', (e) => {
            return this.onUnload(e);
        });
    }

    watch(form: ControlContainer) {
        this.forms.push(form);
    }

    unWatch(form: ControlContainer) {
        this.forms.splice(this.forms.indexOf(form));
    }

    canDeactivate(nestedForm?: ControlContainer) {
        if ((nestedForm && nestedForm.dirty) || this.hasUnsavedChanges()) {
            return window.confirm(this.message());
        }
        return true;
    }

    onUnload(event: BeforeUnloadEvent) {
        if (this.hasUnsavedChanges()) {
            let confirmationMessage = this.message();

            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }

        return null;
    }

    private hasUnsavedChanges() {
        for (let form of this.forms) {
            if (form.dirty) {
                return true;
            }
        }
        return false;
    }

    private message() {
        return this.translateService.instant('i18n.validation.unsavedChanges');
    }
}