import {NavigatorComponent} from './navigator.component';
import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('NavigatorComponent', () => {
	let fixture: ComponentFixture<NavigatorComponent>;
	let component: NavigatorComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				NavigatorComponent
			],
			imports: [RouterTestingModule],
			providers: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavigatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	//TODO: what to test here

	it('should create', () => {
		expect(component).toBeDefined();
	});
});
