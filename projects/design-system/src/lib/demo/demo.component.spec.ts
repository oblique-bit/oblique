import {describe, expect, test} from 'vitest';
import {DemoComponent} from './demo.component';

describe(DemoComponent.name, () => {
	test('creation', () => {
		expect(new DemoComponent()).toBeTruthy();
	});
});
