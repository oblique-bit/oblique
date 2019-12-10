import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ColumnLayoutComponent} from 'oblique';
import {MockColumnPanelDirective} from './mock/mock-column-panel.directive';
import {MockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../_mocks/mock-translate.service';
import {MockMasterLayoutModule} from '../master-layout/mock/mock-master-layout.module';
import {MockScrollingModule} from '../scrolling/mock/mock-scrolling.module';
import {windowProvider, WINDOW} from '../utilities';

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
	left = false;
	right = true;
	configEvents;

	toggleLeft() {
		this.left = true;
	}
}

describe('ColumnLayoutComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ColumnLayoutComponent, MockColumnPanelDirective, MockTranslatePipe],
			imports: [RouterTestingModule, MockMasterLayoutModule, MockScrollingModule],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: WINDOW, useFactory: windowProvider}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

	it('should contain columnLayout class', async(() => {
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).toContain('column-layout');
	}));

});
