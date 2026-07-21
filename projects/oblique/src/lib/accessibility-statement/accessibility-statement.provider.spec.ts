import {
	OB_ACCESSIBILITY_STATEMENT_CONFIGURATION,
	obProvideAccessibilityStatement,
} from './accessibility-statement.provider';
import {ObIAccessibilityStatementConfiguration} from './accessibility-statement.model';
import {TestBed} from '@angular/core/testing';

describe('accessibility-statement.provider', () => {
	const config: ObIAccessibilityStatementConfiguration = {
		applicationName: 'test',
		applicationOperator: 'BIT',
		conformity: 'none',
		createdOn: new Date(),
		contact: [{email: 'oblique@bit.admin.ch'}],
	};
	beforeEach(() => {
		TestBed.configureTestingModule({providers: [obProvideAccessibilityStatement(config)]});
	});

	test(obProvideAccessibilityStatement.name, () => {
		expect(TestBed.inject(OB_ACCESSIBILITY_STATEMENT_CONFIGURATION)).toEqual(config);
	});
});
