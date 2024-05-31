import * as rxjs from 'rxjs';
import {Subject} from 'rxjs';
import {obPauseWhenPageHidden} from './pause-when-page-hidden';

describe(obPauseWhenPageHidden.name, () => {
	beforeEach(() => {
		let index = 0;
		jest.spyOn(document, 'visibilityState', 'get').mockImplementation(() => (index++ % 2 === 0 ? 'hidden' : 'visible'));
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe.each([undefined, document])('with "%s" as parameter', doc => {
		test.each([
			{description: 'emit four times', events: [4], result: [0, 1, 2, 3]},
			{description: 'visibility change, emit twice', events: [0, 2], result: []},
			{description: 'emit once, visibility change, emit twice', events: [1, 2], result: [0]},
			{description: 'emit twice, visibility change, emit twice', events: [2, 2], result: [0, 1]},
			{description: 'visibility change, emit twice, visibility change, emit twice', events: [0, 2, 2], result: [2, 3]},
			{description: 'emit once, visibility change, emit twice, visibility change, emit twice', events: [1, 2, 2], result: [0, 3, 4]},
			{description: 'emit twice, visibility change, emit twice, visibility change, emit twice', events: [2, 2, 2], result: [0, 1, 4, 5]}
		])('$description, yields $result', ({events, result}) => {
			const visibilityChange = new Subject<void>();
			jest.spyOn(rxjs, 'fromEvent').mockImplementation(() => visibilityChange.asObservable());

			const calls: number[] = [];
			const emitter = new Subject<number>();
			emitter.pipe(obPauseWhenPageHidden(doc)).subscribe(number => calls.push(number));

			let index = 0;
			events.forEach(nbr => {
				[...Array(nbr)].forEach(() => emitter.next(index++));
				visibilityChange.next();
			});
			emitter.complete();

			expect(calls).toEqual(result);
		});
	});
});
