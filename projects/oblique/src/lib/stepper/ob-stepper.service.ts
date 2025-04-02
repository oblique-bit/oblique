import {Injectable} from '@angular/core';
import {MatStepperIntl} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ObStepperIntlService extends MatStepperIntl {
	constructor(private readonly translateService: TranslateService) {
		super();
		this.initTranslation();
	}

	private initTranslation(): void {
		this.translateService
			.stream(['i18n.stepper.optional.label', 'i18n.stepper.completed.label', 'i18n.stepper.editable.label'])
			.subscribe(translation => {
				this.optionalLabel = translation['i18n.stepper.optional.label'];
				this.completedLabel = translation['i18n.stepper.completed.label'];
				this.editableLabel = translation['i18n.stepper.editable.label'];
				this.changes.next();
			});
	}
}
