import {ObParentFormDirective} from './parent-form.directive';
import {firstValueFrom} from 'rxjs';

describe('ParentFormDirective', () => {
	it('should create an instance', () => {
		const directive = new ObParentFormDirective();
		expect(directive).toBeTruthy();
	});

	it('should emit submit events', async () => {
		const directive = new ObParentFormDirective();
		const result = firstValueFrom(directive.submit$);
		directive.submit();
		await result;
		expect(true).toBe(true);
	});

	it('should emit reset events', async () => {
		const directive = new ObParentFormDirective();
		const result = firstValueFrom(directive.reset$);
		directive.reset();
		await result;
		expect(true).toBe(true);
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
