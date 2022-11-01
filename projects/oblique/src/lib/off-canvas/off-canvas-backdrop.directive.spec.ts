import {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {ObOffCanvasService} from './off-canvas.service';
import {Subject} from 'rxjs';

describe('ObOffCanvasBackdropDirective', () => {
	const offCanvasService = {open: false} as ObOffCanvasService;
	const keyUpSubject = new Subject<KeyboardEvent>();
	const globalEventMock = {
		keyUp$: keyUpSubject.asObservable()
	};
	let directive: ObOffCanvasBackdropDirective;

	beforeEach(() => {
		directive = new ObOffCanvasBackdropDirective(offCanvasService, globalEventMock as ObGlobalEventsService);
	});

	afterEach(() => {
		jest.resetAllMocks();
		directive.ngOnDestroy();
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('close', () => {
		it('should close the off-canvas service', () => {
			offCanvasService.open = true;
			directive.close();
			expect(offCanvasService.open).toBe(false);
		});
	});

	describe('ngOnInit', () => {
		beforeEach(() => {
			directive.ngOnInit();
		});

		describe.each([
			{key: 'Escape', close: true},
			{key: 'Space', close: false},
			{key: 'Enter', close: false}
		])('when "$key" is pressed', ({key, close}) => {
			it.each([
				{description: `should ${close ? 'close the offCanvas' : 'do nothing'} if the offCanvas is opened`, isOpen: true, result: !close},
				{description: 'should do nothing if the offCanvas is already closed', isOpen: false, result: false}
			])('$description', ({isOpen, result}) => {
				offCanvasService.open = isOpen;
				keyUpSubject.next({key} as KeyboardEvent);
				expect(offCanvasService.open).toBe(result);
			});
		});
	});

	describe('ngOnDestroy', () => {
		it('should not listen to keyboard events anymore', () => {
			directive.ngOnInit();
			directive.ngOnDestroy();
			offCanvasService.open = true;
			keyUpSubject.next({key: 'Escape'} as KeyboardEvent);
			expect(offCanvasService.open).toBe(true);
		});
	});
});
