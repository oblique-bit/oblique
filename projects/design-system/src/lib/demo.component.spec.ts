import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DemoComponent} from './demo.component';

describe(DemoComponent.name, () => {
	let component: DemoComponent;
	let fixture: ComponentFixture<DemoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DemoComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(DemoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('creation', () => {
		expect(component).toBeTruthy();
	});
});
