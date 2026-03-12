import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ObUnknownRouteComponent} from './unknown-route.component';
import {provideObliqueTestingConfiguration} from '../utilities';

describe(ObUnknownRouteComponent.name, () => {
	let component: ObUnknownRouteComponent;
	let fixture: ComponentFixture<ObUnknownRouteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObUnknownRouteComponent, RouterTestingModule],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObUnknownRouteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
