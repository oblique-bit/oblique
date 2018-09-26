import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigatorModule} from '../../../../lib/ng/navigator';
import {MockTranslatePipe} from 'tests';
import {NavigatorSampleComponent} from './navigator-sample.component';

describe('NavigatorSampleComponent', () => {
	let component: NavigatorSampleComponent;
	let fixture: ComponentFixture<NavigatorSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavigatorSampleComponent, MockTranslatePipe],
			imports: [RouterTestingModule, NavigatorModule]
		})
			.compileComponents();
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
