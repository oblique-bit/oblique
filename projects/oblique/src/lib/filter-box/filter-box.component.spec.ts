import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockThemeService} from '../theme/mock/mock-theme.service';
import {ObThemeService, THEMES} from '../theme/theme.service';
import {ObFilterBoxComponent} from './filter-box.component';

@Component({
	template: `
		<ob-filter-box pattern="test">
			<ng-template #prepend><i class="fa fa-search"></i></ng-template>
			<ng-template #append><i class="fa fa-search"></i></ng-template>
		</ob-filter-box>
	`
})
class TestComponent {}

describe('FilterBox', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObFilterBoxComponent, ObMockTranslatePipe],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{provide: ObThemeService, useClass: ObMockThemeService}]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	describe('with Bootstrap theme', () => {
		beforeEach(() => {
			(TestBed.inject(ObThemeService) as ObThemeService).setTheme(THEMES.BOOTSTRAP);
			fixture.detectChanges();
		});

		it('should have an `.input-group-prepend` content projected', fakeAsync(() => {
			tick(100);
			const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
			expect(elements[0].nativeElement.parentElement.classList.contains('input-group-prepend')).toBe(true);
		}));

		it('should have an `.input-group-append` content projected', () => {
			const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
			expect(elements.pop().nativeElement.parentElement.classList.contains('input-group-append')).toBe(true);
		});
	});
});
