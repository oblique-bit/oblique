import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ObNavigatorComponent} from 'oblique';

describe('NavigatorComponent', () => {
	let fixture: ComponentFixture<ObNavigatorComponent>;
	let component: ObNavigatorComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObNavigatorComponent],
			imports: [RouterTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObNavigatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	//TODO: what to test here

	it('should create', () => {
		expect(component).toBeDefined();
	});
});
