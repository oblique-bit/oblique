import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../../_mocks/mock-translate.service';
import {ObINavigationLink} from '../../master-layout.model';
import {ObMasterLayoutNavigationSubMenuItemComponent} from './master-layout-navigation-sub-menu-item.component';
import {ObMasterLayoutNavigationSubMenuItemHarness} from './master-layout-navigation-sub-menu-item.harness';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

describe(ObMasterLayoutNavigationSubMenuItemComponent.name, () => {
	let component: ObMasterLayoutNavigationSubMenuItemComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationSubMenuItemComponent>;
	let harness: ObMasterLayoutNavigationSubMenuItemHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObMasterLayoutNavigationSubMenuItemComponent, ObMockTranslatePipe],
			imports: [BrowserModule, CommonModule],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(ObMasterLayoutNavigationSubMenuItemComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObMasterLayoutNavigationSubMenuItemHarness);
		fixture.autoDetectChanges();
		await fixture.whenStable();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	describe.each<{
		child: ObINavigationLink;
		currentParent: ObINavigationLink;
		description: string;
		getElement: 'getChildLink' | 'getDescendants';
		link: ObINavigationLink;
		promiseResultType: 'resolves' | 'rejects';
		showChildren?: boolean;
	}>([
		{
			child: {id: 'child', label: 'Child', url: 'child'},
			currentParent: {id: 'current-parent-and-link', label: 'CurrentParentAndLink', url: 'current-parent-and-link'},
			getElement: 'getChildLink',
			description: `child link is displayed - when 'link' same as 'currentParent'`,
			link: {id: 'current-parent-and-link', label: 'CurrentParentAndLink', url: 'current-parent-and-link'},
			promiseResultType: 'resolves'
		},
		{
			child: {children: [{label: 'Granchild', url: 'grandchild'}], label: 'Child', url: 'child'},
			currentParent: {label: 'CurrentParent', url: 'current-parent'},
			getElement: 'getDescendants',
			description: `#descendants not displayed - when 'link' not same as 'currentParent', 'child' has children & 'showChildren' is false`,
			link: {label: 'Link', url: 'link'},
			promiseResultType: 'rejects',
			showChildren: false
		},
		{
			child: {label: 'Child', url: 'child'},
			currentParent: {label: 'CurrentParent', url: 'current-parent'},
			getElement: 'getDescendants',
			description: `'#descendants' not displayed - when 'link' not same as 'currentParent', 'showChildren' is true & 'child' has no children,`,
			link: {label: 'Link', url: 'link'},
			promiseResultType: 'rejects',
			showChildren: true
		}
	])('display of child link vs. #descendants', ({child, currentParent, description, getElement, link, promiseResultType}) => {
		beforeEach(async () => {
			component.child = child;
			component.currentParent = currentParent.id;
			component.link = link;
			component.ngOnChanges();
			await fixture.whenStable();
		});

		test(`that ${description}`, async () => {
			await expect(harness[getElement]())[promiseResultType].toBeTruthy();
		});
	});
});
