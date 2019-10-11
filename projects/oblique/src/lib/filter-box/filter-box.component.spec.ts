import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {FilterBoxComponent, ThemeService} from 'oblique';
import {BehaviorSubject} from 'rxjs';
import {MockTranslatePipe} from 'tests';
import {By} from '@angular/platform-browser';

@Component({
	template: `
		<or-filter-box pattern="test">
			<ng-template #prepend><i class="fa fa-search"></i></ng-template>
			<ng-template #append><i class="fa fa-search"></i></ng-template>
		</or-filter-box>
	`
})
class TestComponent {
}

describe('FilterBox', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
		const themeMock = {
			theme$: new BehaviorSubject(undefined),
			isMaterial: () => false
		};
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				FilterBoxComponent,
				MockTranslatePipe
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{provide: ThemeService, useValue: themeMock}]
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

	it('should have an `.input-group-prepend` content projected', () => {
		const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
		expect(elements[0].nativeElement.parentElement.classList.contains('input-group-prepend')).toBe(true);
	});

	it('should have an `.input-group-append` content projected', () => {
		const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
		expect(elements.pop().nativeElement.parentElement.classList.contains('input-group-append')).toBe(true);
	});
});
