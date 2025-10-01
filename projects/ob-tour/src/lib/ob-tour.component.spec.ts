import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ObTourComponent} from './ob-tour.component';

describe(ObTourComponent.name, () => {
	let component: ObTourComponent;
	let fixture: ComponentFixture<ObTourComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObTourComponent, TranslateModule]
		}).compileComponents();
	});

	test('component exists', () => {
		fixture = TestBed.createComponent(ObTourComponent);
		component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	test('fixture exists', () => {
		fixture = TestBed.createComponent(ObTourComponent);
		component = fixture.componentInstance;
		expect(fixture).toBeTruthy();
	});
});
