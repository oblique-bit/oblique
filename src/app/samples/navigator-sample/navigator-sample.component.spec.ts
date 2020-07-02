import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigatorSampleComponent} from './navigator-sample.component';
import {ObliqueTestingModule} from 'projects/oblique/src/lib/oblique-testing.module';

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
