import {TestBed} from '@angular/core/testing';
import {TestComponent} from './test.component';

describe(TestComponent.name, () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent]
		}).compileComponents();
	});

	test('creation', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});
});
