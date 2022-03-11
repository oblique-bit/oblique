import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ObStickyComponent} from './sticky.component';

@Component({
	template: ` <ob-sticky [headerSize]="headerSize" [footerSize]="footerSize">
		<ng-template #obStickyHeader *ngIf="stickyHeader">test</ng-template>
		<ng-template #obStickyMain>test</ng-template>
		<ng-template #obStickyFooter *ngIf="stickyFooter">
			<div class="ob-sticky-actions">sdfsdfsdf</div>
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

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TestFirstCaseComponent, ObStickyComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(
		waitForAsync(() => {
			fixture = TestBed.createComponent(TestFirstCaseComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(testComponent).toBeTruthy();
	});

	it('should contain sticky class', () => {
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('ob-sticky');
	});

	it('should contain sticky-sm and not sticky-lg class with small header', () => {
		testComponent.headerSize = 'sm';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('ob-sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('ob-sticky-lg');
	});

	it('should contain sticky-lg and not sticky-sm class with large header', () => {
		testComponent.headerSize = 'lg';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('ob-sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).toContain('ob-sticky-lg');
	});

	it('should not contain neither sticky-lg nor sticky-sm with medium (default) header', () => {
		testComponent.headerSize = 'md';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('ob-sticky-sm');
		expect(fixture.debugElement.query(By.css('ob-sticky')).nativeElement.classList).not.toContain('ob-sticky-lg');
	});

	it('should throw an error with illegal size', () => {
		const comp = fixture.debugElement.query(By.css('ob-sticky')).componentInstance;
		comp.headerSize = 'testSize';
		expect(comp.ngOnChanges.bind(comp)).toThrowError(
			'"testSize" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.'
		);
	});
});
