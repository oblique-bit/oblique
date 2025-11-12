import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideObliqueTestingConfiguration} from '../utilities';
import {ObTopControlComponent} from './top-control.component';
import {Observable} from 'rxjs';

describe('ObTopControlComponent', () => {
	let fixture: ComponentFixture<ObTopControlComponent>;
	let topControlComponent: ObTopControlComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObTopControlComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObTopControlComponent);
		topControlComponent = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(topControlComponent).toBeDefined();
	});

	it('should have ob-top-control class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-top-control')).toBe(true);
	});

	describe('scrollToTop', () => {
		it('should be an observable', () => {
			expect(topControlComponent.scrollToTop instanceof Observable).toBe(true);
		});
		it('should emit when scrollTop is called', () => {
			jest.spyOn(topControlComponent.scrollToTop, 'emit');
			topControlComponent.scrollTop();
			expect(topControlComponent.scrollToTop.emit).toHaveBeenCalledWith();
		});
	});
});
