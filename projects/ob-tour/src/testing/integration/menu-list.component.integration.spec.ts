import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TranslateModule, TranslateService, provideTranslateService} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObButtonModule, ObIconModule} from '@oblique/oblique';

import {MenuListComponent} from '../../lib/tour-menu/menu-list/menu-list.component';
import {ObtMenuListHarness} from './_harness/menu-list.harness';
import type {ObtTour, ObtTourState} from '../../lib/models/tour.model';

const translationKeys = {
	en: {
		'i18n.ob-tour.tour-menu.list.element.1.title': 'Title 1',
		'i18n.ob-tour.tour-menu.list.element.1.description': 'Description 1',
		'i18n.ob-tour.tour-menu.list.button.tooltip.start': 'Start tour',
		'i18n.ob-tour.tour-menu.list.button.tooltip.skip': 'Skip tour',
		'i18n.ob-tour.tour-menu.list.button.tooltip.restart': 'Restart tour',
		'i18n.ob-tour.tour-menu.list.button.tooltip.resume': 'Resume tour',
		'i18n.ob-tour.tour-menu.list.title.new': 'New Tours',
		'i18n.ob-tour.tour-menu.list.title.done': 'Finished Tours',
		'i18n.ob-tour.tour-menu.list.title.inProgress': 'In Progress Tours'
	}
};

const translateTestConfig = {
	locales: ['en'],
	defaultLanguage: 'en',
	useDefaultLang: true,
	translations: translationKeys
};

@Component({
	selector: 'obt-test-menu-list',
	standalone: true,
	imports: [MenuListComponent, TranslateModule, MatButtonModule, MatIconModule, ObButtonModule, MatTooltipModule],
	template: `
		@for (type of types; track $index) {
			<obt-menu-list
				[listTitle]="'i18n.ob-tour.tour-menu.list.title.' + type | translate"
				[listItems]="createList(type)"
				[listType]="type"
			/>
		}
	`
})
class MenuListTestComponent {
	types: ObtTourState[] = ['new', 'inProgress', 'done'];

	createList(type: ObtTourState): ObtTour[] {
		return [
			{
				storageKey: '2',
				steps: [],
				tourTitle: `i18n.ob-tour.tour-menu.list.element.1.title`,
				tourDescription: `i18n.ob-tour.tour-menu.list.element.1.description`,
				state: type
			},
			{
				storageKey: '1',
				steps: [],
				tourTitle: `Custom ${type} Tour`,
				tourDescription: `Custom description for ${type}`,
				state: type
			}
		];
	}
}

describe('Integration: MenuListComponent inside MenuListTestComponent', () => {
	let fixture: ComponentFixture<MenuListTestComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MenuListTestComponent, TranslateModule.forRoot()],
			providers: [provideTranslateService(translateTestConfig)]
		}).compileComponents();

		const translate = TestBed.inject(TranslateService);
		translate.setTranslation('en', translationKeys.en);
		translate.use('en');

		fixture = TestBed.createComponent(MenuListTestComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	describe.each(['new', 'inProgress', 'done'] as ObtTourState[])('list type %s', state => {
		let harness: ObtMenuListHarness;

		beforeEach(async () => {
			harness = await loader.getHarness(ObtMenuListHarness.with({listType: state}));
		});

		it(`renders the translated list title for ${state}`, async () => {
			const expected = translationKeys.en[`i18n.ob-tour.tour-menu.list.title.${state}`];
			const titleText = await harness.getListTitleText(state);
			expect(titleText.trim()).toBe(expected);
		});

		it('renders all provided list items', async () => {
			const count = await harness.getListItemCount();
			expect(count).toBe(2);
		});

		it('renders expected action buttons', async () => {
			const buttons = await harness.getActionButtons();
			expect(buttons.length).toBeGreaterThan(0);
		});

		it('allows clicking an action button via aria-label', async () => {
			const startLabel = 'i18n.ob-tour.tour-menu.list.button.aria.start';
			await harness.clickActionByAriaLabel(startLabel);
			expect(true).toBeTruthy();
		});

		it('renders an icon for each action button', async () => {
			const icons = await harness.getIcons();
			const buttons = await harness.getActionButtons();
			expect(icons.length).toBeGreaterThanOrEqual(buttons.length);
		});
	});

	it('ensures list section has accessible label via aria-labelledby', () => {
		const host: HTMLElement = fixture.nativeElement;
		const section = host.querySelector('section.obt-tour-list');
		expect(section?.hasAttribute('aria-labelledby')).toBe(true);
	});

	it('ensures title id matches aria-labelledby reference', () => {
		const host: HTMLElement = fixture.nativeElement;
		const section = host.querySelector('section.obt-tour-list');
		const titleId = section?.getAttribute('aria-labelledby');
		const title = host.querySelector(`#${titleId}`);
		expect(title?.textContent?.trim()).toBe('New Tours');
	});

	it('supports all defined TOUR_STATES in harness', async () => {
		const harness = await loader.getHarness(ObtMenuListHarness.with({listType: 'new'}));
		expect(harness.states).toEqual(['new', 'done', 'inProgress', 'skipped']);
	});

	it.each(['new', 'done', 'inProgress'])(`can resolve a harness for list type %s`, async type => {
		const subHarness = await loader.getHarness(ObtMenuListHarness.with({listType: type as ObtTourState}));
		expect(subHarness).toBeTruthy();
	});
});

@Component({
	selector: 'obt-host-menu-list',
	standalone: true,
	imports: [MenuListComponent],
	template: ` <obt-menu-list [listTitle]="listTitle" [listItems]="listItems" [listType]="listType" /> `
})
class HostMenuListComponent {
	listTitle = 'New Tours';
	listType: ObtTourState = 'new';
	listItems: ObtTour[] = [
		{
			storageKey: 'abede',
			tourTitle: 'Tour 1',
			tourDescription: 'Description 1',
			state: 'new',
			steps: []
		}
	];
}

describe.each(['new', 'inProgress', 'done'] as ObtTourState[])('Integration: MenuListComponent standalone (%s)', listType => {
	let fixture: ComponentFixture<HostMenuListComponent>;
	let loader: HarnessLoader;
	let harness: ObtMenuListHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HostMenuListComponent,
				MenuListComponent,
				BrowserTestingModule,
				TranslateModule.forRoot(),
				MatIconModule,
				ObIconModule,
				ObButtonModule,
				MatButtonModule
			],
			providers: [provideTranslateService(translateTestConfig)]
		}).compileComponents();

		const translate = TestBed.inject(TranslateService);
		translate.setTranslation('en', translationKeys.en);
		translate.use('en');

		fixture = TestBed.createComponent(HostMenuListComponent);
		fixture.componentInstance.listType = listType;
		fixture.detectChanges();

		loader = TestbedHarnessEnvironment.loader(fixture);
		harness = await loader.getHarness(ObtMenuListHarness.with({listType}));
	});

	it('renders the translated list title', async () => {
		const title = await harness.getListTitleText();
		expect(title).toContain('Tours');
	});

	it('renders exactly one list item for one provided tour', async () => {
		const count = await harness.getListItemCount();
		expect(count).toBe(1);
	});

	it('displays all expected action buttons', async () => {
		const buttons = await harness.getActionButtons();
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('renders an icon element for every defined action button', async () => {
		const icons = await harness.getIcons();
		const buttons = await harness.getActionButtons();
		expect(icons.length).toBeGreaterThanOrEqual(buttons.length);
	});
});
