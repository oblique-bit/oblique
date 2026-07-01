import {ObEIcon} from '../icon/icon.model';
import {NonEmptyArray} from '../utilities.model';

export type ObConformity = ObConformityPartial | ObConformityNonPartial;

export interface ObIAccessibilityStatementContactInfo {
	label: string;
	url: string;
	icon: ObEIcon;
	context: string;
	isExternal: boolean;
}

export type ObIAccessibilityStatementConfiguration =
	ObIAccessibilityStatementConfigurationPartial | ObIAccessibilityStatementConfigurationNonPartial;

interface ObIAccessibilityStatementConfigurationPartial extends ObIAccessibilityStatementConfigurationBase {
	exceptions: NonEmptyArray<string>;
	conformity: ObConformityPartial;
}

interface ObIAccessibilityStatementConfigurationNonPartial extends ObIAccessibilityStatementConfigurationBase {
	conformity: ObConformityNonPartial;
}

type ObConformityPartial = 'partial';
type ObConformityNonPartial = 'none' | 'full';

interface ObIAccessibilityStatementConfigurationBase {
	applicationName: string;
	createdOn: Date;
	reviewedOn?: Date;
	applicationOperator: string;
	contact: NonEmptyArray<ObContactData>;
}

export type ObContactData = ObContactPhone | ObContactEmail | ObContactUrl;

interface ObContactEmail extends ObContactInfoBase {
	email: string;
	phone?: never;
	url?: never;
}

interface ObContactPhone extends ObContactInfoBase {
	email?: never;
	phone: string;
	url?: never;
}

interface ObContactUrl extends ObContactInfoBase {
	email?: never;
	phone?: never;
	url: string;
}

interface ObContactInfoBase {
	context?: string;
}
