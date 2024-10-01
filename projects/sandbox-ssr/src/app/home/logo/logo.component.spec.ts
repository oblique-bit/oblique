import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LogoComponent} from './logo.component';

describe(LogoComponent.name, () => {
	let component: LogoComponent;
	let fixture: ComponentFixture<LogoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LogoComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(LogoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('component creation', () => {
		expect(component).toBeTruthy();
	});
});
