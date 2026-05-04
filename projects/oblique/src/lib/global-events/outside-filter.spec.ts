import {fromEvent} from 'rxjs';
import {obOutsideFilter} from './outside-filter';

describe('obOutsideFilter', () => {
	let div1: HTMLDivElement;
	let div2: HTMLDivElement;
	let span: HTMLSpanElement;
	const clickEvent = fromEvent(document, 'click');

	beforeEach(() => {
		div1 = document.createElement('div');
		div2 = document.createElement('div');
		span = document.createElement('span');
		div1.appendChild(span);
		document.querySelector('body').appendChild(div1);
		document.querySelector('body').appendChild(div2);
	});

	it('should emit a MouseEvent on document click', done => {
		clickEvent.pipe(obOutsideFilter(div1, div2)).subscribe(event => {
			expect(event instanceof MouseEvent).toBe(true);
			done();
		});
		document.querySelector('body').click();
	});

	it('should not emit on excluded element click', () => {
		let emitted = false;
		clickEvent.pipe(obOutsideFilter(div1, div2)).subscribe(() => {
			emitted = true;
		});
		div1.click();
		expect(emitted).toBe(false);
	});

	it("should not emit on excluded element's child click", () => {
		let emitted = false;
		clickEvent.pipe(obOutsideFilter(div1, div2)).subscribe(() => {
			emitted = true;
		});
		span.click();
		expect(emitted).toBe(false);
	});
});
