import {TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {CollectorService} from './collector.service';

describe(CollectorService.name, () => {
	let service: CollectorService;
	let dialog: MatDialog;

	beforeEach(() => {
		TestBed.configureTestingModule({providers: [CollectorService]});
		service = TestBed.inject(CollectorService);
		dialog = TestBed.inject(MatDialog);
	});

	test('that is is created', () => {
		expect(service).toBeTruthy();
	});

	describe(`method ${CollectorService.prototype.initializeCollector.name}`, () => {
		beforeEach(() => {
			service.initializeCollector('id');
		});

		describe('collector script', () => {
			let scriptNode: HTMLScriptElement;
			beforeEach(() => {
				scriptNode = document.querySelector('script');
			});

			test('that it is added to the DOM', () => {
				expect(scriptNode).toBeTruthy();
			});

			test('that it has the correct source', () => {
				expect(scriptNode.src).toBe('https://jira.bit.admin.ch/plugins/servlet/issueCollectorBootstrap.js?collectorId=id&locale=en_US');
			});
		});

		describe('Atlassian properties', () => {
			test('that they are set', () => {
				expect(window.ATL_JQ_PAGE_PROPS).toBeTruthy();
			});

			test('that they contain 2 properties', () => {
				expect(Object.keys(window.ATL_JQ_PAGE_PROPS).length).toBe(2);
			});

			test('that they contain a "triggerFunction" property', () => {
				expect(window.ATL_JQ_PAGE_PROPS.triggerFunction).toBeTruthy();
			});

			test('that they contain a "fieldValues" property', () => {
				expect(window.ATL_JQ_PAGE_PROPS.fieldValues).toBeTruthy();
			});
		});
	});

	describe(`method ${CollectorService.prototype.collect.name}`, () => {
		describe('with collector', () => {
			describe('without defaultValues', () => {
				const triggerFunction = jest.fn();
				beforeEach(() => {
					service.initializeCollector('id');
					window.ATL_JQ_PAGE_PROPS.triggerFunction(triggerFunction);
					jest.spyOn(dialog, 'open');
					service.collect();
				});

				test('that the trigger function is called', () => {
					expect(triggerFunction).toHaveBeenCalled();
				});

				test('that the fieldValues are empty', () => {
					expect(Object.keys(window.ATL_JQ_PAGE_PROPS.fieldValues).length).toBe(0);
				});
			});

			describe.each([{key1: () => 'a'}, {key2: () => 'b', key3: () => 'b'}])('with defaultValues (%s)', configuration => {
				const triggerFunction = jest.fn();
				const keys = Object.keys(configuration);
				beforeEach(() => {
					service.initializeCollector('id');
					service.defaultValues = configuration;
					window.ATL_JQ_PAGE_PROPS.triggerFunction(triggerFunction);
					window.ATL_JQ_PAGE_PROPS.fieldValues();
					service.collect();
				});

				test('that the trigger function is called', () => {
					expect(triggerFunction).toHaveBeenCalled();
				});

				test(`that the fieldValues contains ${keys.length} values`, () => {
					expect(Object.keys(window.ATL_JQ_PAGE_PROPS.fieldValues).length).toBe(keys.length);
				});

				test.each(keys)('that the fieldValues contains a "%s" property', key => {
					expect(Object.keys(window.ATL_JQ_PAGE_PROPS.fieldValues).includes(key)).toBe(true);
				});

				test.each(keys)('that the fieldValues has the correct value for %s property', key => {
					expect(window.ATL_JQ_PAGE_PROPS.fieldValues[key]).toBe(configuration[key]());
				});
			});
		});

		describe('without collector', () => {
			beforeEach(() => {
				jest.spyOn(dialog, 'open').mockReturnValue({afterClosed: () => of(undefined)} as MatDialogRef<unknown>);
				service.fallbackDialog = undefined;
				service.collect();
			});

			test('that the dialog is opened', () => {
				expect(dialog.open).toHaveBeenCalled();
			});
		});
	});
});
