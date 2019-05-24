import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StickyComponent} from './sticky.component';
import {By} from '@angular/platform-browser';

@Component({
	template: `
		<or-sticky [headerSize]="headerSize" [footerSize]="footerSize">
			<ng-template #orStickyHeader *ngIf="stickyHeader">
				test
			</ng-template>
			<ng-template #orStickyMain>
				test
			</ng-template>
			<ng-template #orStickyFooter *ngIf="stickyFooter">
				<div class="sticky-actions">
					sdfsdfsdf
				</div>
			</ng-template>
		</or-sticky>`
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
			declarations: [TestFirstCaseComponent, StickyComponent],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestFirstCaseComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create the sticki', async(() => {
		expect(testComponent).toBeTruthy();
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).toContain('sticky');
	}));

	it('should test if is stickyheader is sm', async () => {
		testComponent.headerSize = 'sm';
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).toContain('sticky-sm');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-md');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-lg');
	});

	it('should test if is stickyheader is lg', async () => {
		testComponent.headerSize = 'lg';
		fixture.detectChanges();
		console.log(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList);
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).toContain('sticky-lg');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-md');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-sm');
	});


	it('should test if is stickyheader is md', async () => {
		testComponent.headerSize = 'md';
		fixture.detectChanges();
		console.log(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList);
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).toContain('sticky');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-lg');
		expect(fixture.debugElement.query(By.css('or-sticky')).nativeElement.classList).not.toContain('sticky-sm');
	});

	it('should test if is stickyheader is md', async () => {
		const comp = fixture.debugElement.query(By.css('or-sticky')).componentInstance;
		comp.headerSize = 'testSize';
		expect(comp.ngOnChanges.bind(comp)).toThrowError(
			'"testSize" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.');
	});
});
