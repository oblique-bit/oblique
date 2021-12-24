import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {StickySampleComponent} from './sticky-sample.component';
import {ObliqueTestingModule} from 'projects/oblique/src/lib/oblique-testing.module';

describe('StickySampleComponent', () => {
	let component: StickySampleComponent;
	let fixture: ComponentFixture<StickySampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObliqueTestingModule],
				declarations: [StickySampleComponent],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(StickySampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
