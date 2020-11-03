import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ObStickyComponent} from './sticky.component';

@Component({
	template: ` <ob-sticky [headerSize]="headerSize" [footerSize]="footerSize">
		<ng-template #obStickyHeader *ngIf="stickyHeader">test</ng-template>
		<ng-template #obStickyMain>test</ng-template>
		<ng-template #obStickyFooter *ngIf="stickyFooter">
			<div class="sticky-actions">sdfsdfsdf</div>
		</ng-template>
	</ob-sticky>`
})
class TestFirstCaseComponent {
	stickyHeader = true;
	stickyFooter = true;
	footerSize = 'md';
	headerSize = 'md';
}

describe('StickyComponent', () => {
	let fixture: ComponentFixture<TestFirstCaseComponent>;
	let testComponent: TestFirstCaseComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestFirstCaseComponent, ObStickyComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestFirstCaseComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', async(() => {
		expect(testComponent).toBeTruthy();
	}));

	it('should contain sticky class', async(() => {
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('sticky');
	}));

	it('should contain sticky-sm and not sticky-lg class with small header', async () => {
		testComponent.headerSize = 'sm';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('sticky-lg');
	});

	it('should contain sticky-lg and not sticky-sm class with large header', async () => {
		testComponent.headerSize = 'lg';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('sticky-lg');
	});

	it('should not contain neither sticky-lg nor sticky-sm with medium (default) header', async () => {
		testComponent.headerSize = 'md';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('sticky-lg');
	});

	it('should throw an error with illegal size', async () => {
		const comp = fixture.debugElement.query(By.css('ob-sticky')).componentInstance;
		comp.headerSize = 'testSize';
		expect(comp.ngOnChanges.bind(comp)).toThrowError('"testSize" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.');
	});
});
