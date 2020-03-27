import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ObliqueTestingModule} from 'oblique';
import {NavigatorSampleComponent} from './navigator-sample.component';

describe('NavigatorSampleComponent', () => {
	let component: NavigatorSampleComponent;
	let fixture: ComponentFixture<NavigatorSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavigatorSampleComponent],
			imports: [RouterTestingModule, ObliqueTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavigatorSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
