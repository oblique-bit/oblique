import {InjectionToken, Provider} from '@angular/core';
import {ObIAccessibilityStatementConfiguration} from './accessibility-statement.model';
import {ObIHistoryState} from '../utilities.model';

export const OB_ACCESSIBILITY_STATEMENT_CONFIGURATION = new InjectionToken<ObIAccessibilityStatementConfiguration>(
	'AccessibilityStatementConfiguration'
);

export const OB_HISTORY_STATE = new InjectionToken<ObIHistoryState>('History state');

export function obProvideAccessibilityStatement(
	configAccessibilityStatement: ObIAccessibilityStatementConfiguration,
	configHistoryState: ObIHistoryState
): Provider[] {
	return [
		{provide: OB_HISTORY_STATE, useValue: configHistoryState},
		{provide: OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, useValue: configAccessibilityStatement},
	];
}

export const obDefaultAccessibilityStatement: ObIAccessibilityStatementConfiguration = {
	applicationName: 'Test application',
	createdOn: new Date('2025-01-01'),
	conformity: 'none',
	applicationOperator: 'Test operator',
	contact: [{email: 'test@example.com'}],
};

export const obDefaultHistoryState: ObIHistoryState = {
	initialLength: 0,
};
