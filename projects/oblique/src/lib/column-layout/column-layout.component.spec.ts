import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ColumnLayoutComponent, MasterLayoutNavigationService, MasterLayoutService} from 'oblique';
import {ColumnPanelDirective} from './column-panel.directive';
import {ColumnToggleDirective} from './column-toggle.directive';
import {MockTranslatePipe, MockTranslateService} from 'tests';
import {TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

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
		/* Do nothing */
		this.left = true;
	}

}

describe('ColumnLayoutComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;

	const mockMasterLayoutNavigationService = {
		isCustom: jest.fn(),
		navigation: {links: []}
	};

	const mockMasterLayoutService = {
		layout: {
			isFixed: false,
			hasCover: false,
			isMenuOpened: false,
			hasMainNavigation: true,
			configEvents: of({})
		},
		footer: {
			isSmall: false
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockTranslatePipe,
				ColumnLayoutComponent,
				TestComponent,
				ColumnPanelDirective,
				ColumnToggleDirective
			],
			imports: [
				RouterTestingModule,
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			],
			providers: [
				{provide: TranslateService, useValue: MockTranslateService},
				{ provide: MasterLayoutNavigationService, useValue: mockMasterLayoutNavigationService },
				{ provide: MasterLayoutService, useValue: mockMasterLayoutService },
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

	it('should contain columnLayout class', async(() => {
		expect(fixture.debugElement.query(By.css('or-column-layout')).nativeElement.classList).toContain('column-layout');
	}));

});
