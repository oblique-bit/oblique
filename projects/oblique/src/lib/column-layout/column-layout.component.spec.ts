import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObColumnLayoutComponent} from 'oblique';
import {ObMockColumnPanelDirective} from './mock/mock-column-panel.directive';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMockMasterLayoutModule} from '../master-layout/mock/mock-master-layout.module';
import {ObMockScrollingModule} from '../scrolling/mock/mock-scrolling.module';
import {windowProvider, WINDOW} from '../utilities';

@Component({
	template: ` <ob-column-layout [left]="left" [right]="right" obColumnPanel>
		<div column-left-content>
			<h3 class="nav-header-title">Left Column</h3>
		</div>
		<div column-main-content>
			<h1>Three-Column Layout</h1>
			<p>Lorem ipsum dolor sit amet, consectetur</p>
		</div>
		<div column-right-content>
			<h3 class="nav-header-title">Right Column</h3>
		</div>
	</ob-column-layout>`
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
			declarations: [TestComponent, ObColumnLayoutComponent, ObMockColumnPanelDirective, ObMockTranslatePipe],
			imports: [RouterTestingModule, ObMockMasterLayoutModule, ObMockScrollingModule],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
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
		expect(fixture.debugElement.query(By.css('ob-column-layout')).nativeElement.classList).toContain('column-layout');
	}));
});
