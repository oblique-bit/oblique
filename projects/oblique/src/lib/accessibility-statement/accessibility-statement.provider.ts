import {InjectionToken, Provider} from '@angular/core';
import {ObIAccessibilityStatementConfiguration} from './accessibility-statement.model';

export const OB_ACCESSIBILITY_STATEMENT_CONFIGURATION = new InjectionToken<ObIAccessibilityStatementConfiguration>(
	'AccessibilityStatementConfiguration'
);

export function provideAccessibilityStatement(config: ObIAccessibilityStatementConfiguration): Provider[] {
	return [{provide: OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, useValue: config}];
}

export const defaultAccessibilityStatement: ObIAccessibilityStatementConfiguration = {
	applicationName: 'Test application',
	createdOn: new Date('2025-01-01'),
	conformity: 'none',
	applicationOperator: 'Test operator',
	contact: [{email: 'test@example.com'}],
};
