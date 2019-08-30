import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ColumnLayoutComponent} from 'oblique';

@Component({
	template: `
        <or-column-layout [left]="left" [right]="right" orColumnPanel>
            <div column-left-content class="default-layout">
                <h3 class="nav-header-title">Left Column</h3>
            </div>
            <div column-main-content class="default-layout">
                <h1>Three-Column Layout</h1>
                <p>Lorem ipsum dolor sit amet, consectetur </p>
            </div>
            <div column-right-content class="default-layout">
                <h3 class="nav-header-title">Right Column</h3>
            </div>
        </or-column-layout>`
})
class TestComponent {
	left = true;
	right = true;
}

describe('ColumnLayoutComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent
				// ColumnLayoutComponent
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', async(() => {
		expect(testComponent).toBeTruthy();
	}));

	xit('should contain columnLayout class', async(() => {
		const test = fixture.debugElement.query(By.css('or-column-layout')).nativeElement;
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).toContain('column-layout');
	}));

	xit('should contain column-left and not column-right class with small header', async () => {
		testComponent.left = true;
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).toContain('column-left');
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).not.toContain('column-right');
	});

	xit('should contain column-right and not column-left class with large header', async () => {
		testComponent.left = true;
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).not.toContain('column-left');
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).toContain('column-right');
	});

	xit('should not contain neither column-right nor column-left with medium (default) header', async () => {
		testComponent.left = true;
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).not.toContain('column-left');
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).not.toContain('column-right');
	});
});
