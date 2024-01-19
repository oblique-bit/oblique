import {TestBed} from '@angular/core/testing';
import {CollectorService} from './collector.service';

describe(CollectorService.name, () => {
	let service: CollectorService;

	beforeEach(() => {
		TestBed.configureTestingModule({providers: [CollectorService]});
		service = TestBed.inject(CollectorService);
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

			test('that they contain 1 property', () => {
				expect(Object.keys(window.ATL_JQ_PAGE_PROPS).length).toBe(1);
			});

			test('that they contain a "triggerFunction" property', () => {
				expect(window.ATL_JQ_PAGE_PROPS.triggerFunction).toBeTruthy();
			});
		});
	});

	describe(`method ${CollectorService.prototype.collect.name}`, () => {
		const triggerFunction = jest.fn();
		beforeEach(() => {
			service.initializeCollector('id');
			window.ATL_JQ_PAGE_PROPS.triggerFunction(triggerFunction);
			service.collect();
		});

		test('that the trigger function is called', () => {
			expect(triggerFunction).toHaveBeenCalled();
		});
	});
});
