import {TestBed} from '@angular/core/testing';
import {TestComponent} from './test.component';
import {TranslateModule} from '@ngx-translate/core';

describe(TestComponent.name, () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent, TranslateModule.forRoot()],
		}).compileComponents();
	});

	test('creation', () => {
		const fixture = TestBed.createComponent(TestComponent);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});
});
