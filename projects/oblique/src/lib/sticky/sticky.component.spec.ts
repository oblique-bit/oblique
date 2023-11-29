import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
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

describe(ObStickyComponent.name, () => {
	let fixture: ComponentFixture<TestFirstCaseComponent>;
	let component: TestFirstCaseComponent;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObStickyComponent],
			declarations: [TestFirstCaseComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(waitForAsync(() => {
		fixture = TestBed.createComponent(TestFirstCaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should contain sticky class', () => {
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).toContain('ob-sticky');
	});

	it('should contain sticky-sm class with small header', () => {
		component.headerSize = 'sm';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).toContain('ob-sticky-sm');
	});

	it('should not contain sticky-lg class with small header', () => {
		component.headerSize = 'sm';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).not.toContain('ob-sticky-lg');
	});

	it('should contain sticky-lg class with large header', () => {
		component.headerSize = 'lg';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).toContain('ob-sticky-lg');
	});

	it('should not contain sticky-sm class with large header', () => {
		component.headerSize = 'lg';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).not.toContain('ob-sticky-sm');
	});

	it('should not contain sticky-lg class with medium (default) header', () => {
		component.headerSize = 'md';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).not.toContain('ob-sticky-lg');
	});

	it('should not contain sticky-sm class with medium (default) header', () => {
		component.headerSize = 'md';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.directive(ObStickyComponent)).nativeElement.classList).not.toContain('ob-sticky-sm');
	});

	it('should throw an error with illegal size', () => {
		const comp = fixture.debugElement.query(By.directive(ObStickyComponent)).componentInstance;
		comp.headerSize = 'testSize';
		expect(comp.ngOnChanges.bind(comp)).toThrow('"testSize" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.');
	});
});
