import {ObParentFormDirective} from './parent-form.directive';

describe('ParentFormDirective', () => {
	it('should create an instance', () => {
		const directive = new ObParentFormDirective();
		expect(directive).toBeTruthy();
	});

	it('should emit submit events', done => {
		const directive = new ObParentFormDirective();
		directive.submit$.subscribe(() => {
			expect(true).toBe(true);
			done();
		});

		directive.submit();
	});

	it('should emit reset events', done => {
		const directive = new ObParentFormDirective();
		directive.reset$.subscribe(() => {
			expect(true).toBe(true);
			done();
		});

		directive.reset();
	});

	it('should complete streams on destroy', () => {
		const directive = new ObParentFormDirective();
		const submitComplete = jest.fn();
		const resetComplete = jest.fn();
		directive.submit$.subscribe({complete: submitComplete});
		directive.reset$.subscribe({complete: resetComplete});

		directive.ngOnDestroy();

		expect(submitComplete).toHaveBeenCalled();
		expect(resetComplete).toHaveBeenCalled();
	});
});
