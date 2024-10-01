import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';

describe(HomeComponent.name, () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('component creation', () => {
		expect(component).toBeTruthy();
	});
});
