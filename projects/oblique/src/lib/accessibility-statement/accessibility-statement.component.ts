import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.pipe';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObIAccessibilityStatementConfiguration} from '../utilities.model';
import {OB_ACCESSIBILITY_STATEMENT_CONFIGURATION} from '../utilities';
import {ObDatePipe} from '../language/date.pipe';

@Component({
	selector: 'ob-accessibility-statement',
	imports: [ObExternalLinkModule, TranslateModule, ObTranslateParamsPipe, ObDatePipe, MatIcon],
	templateUrl: './accessibility-statement.component.html',
	styleUrl: './accessibility-statement.component.scss'
})
export class AccessibilityStatementComponent {
	readonly parameters = inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION);
	readonly statementParameters = {
		applicationName: this.parameters.applicationName,
		conformity: this.getConformity(this.parameters),
		exceptionText: this.getConformityText(this.parameters)
	};
	readonly contactParameters = {
		emails: (this.parameters.contact as {emails: string[]}).emails ?? [],
		phones: (this.parameters.contact as {phones: string[]}).phones ?? []
	};
	readonly generalLinks = [
		{
			label: 'i18n.oblique.accessibility-statement.general-information.links.e-accessibility.label',
			url: 'i18n.oblique.accessibility-statement.general-information.links.e-accessibility.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.general-information.links.guidance.label',
			url: 'i18n.oblique.accessibility-statement.general-information.links.guidance.url'
		}
	];
	readonly accessibilityLinks = [
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.standard.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.standard.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.ordinance.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.ordinance.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.disability.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.disability.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.equality.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.equality.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.rights.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.rights.url'
		},
		{
			label: 'i18n.oblique.accessibility-statement.accessibility.links.principles.label',
			url: 'i18n.oblique.accessibility-statement.accessibility.links.principles.url'
		}
	];

	private getConformity(parameters: ObIAccessibilityStatementConfiguration): string {
		if (!parameters.createdOn) {
			return 'i18n.oblique.accessibility-statement.statement.none';
		}
		return parameters.exceptions?.length
			? 'i18n.oblique.accessibility-statement.statement.partial'
			: 'i18n.oblique.accessibility-statement.statement.full';
	}

	private getConformityText(parameters: ObIAccessibilityStatementConfiguration): string {
		return parameters.exceptions?.length > 0
			? 'i18n.oblique.accessibility-statement.statement.exception'
			: 'i18n.oblique.accessibility-statement.statement.no-exception';
	}
}
