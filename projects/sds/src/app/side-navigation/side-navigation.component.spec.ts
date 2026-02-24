import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {IdPipe} from '../shared/id/id.pipe';
import {getDebugElementById} from '../../test-helpers/unit-test-helpers/unit-test-helpers';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {ImageComponent} from './image/image.component';
import {SideNavigationComponent} from './side-navigation.component';
import {VersionComponent} from './version/version.component';
import {WINDOW} from '@oblique/oblique';
import {CmsDataService} from '../cms/cms-data.service';
import {filter, firstValueFrom, of} from 'rxjs';
import {VersionService} from '../shared/version/version.service';

type SideNavigationIds = 'accordion-links' | 'logo' | 'search-input' | 'version';

describe(SideNavigationComponent.name, () => {
	let component: SideNavigationComponent;
	let fixture: ComponentFixture<SideNavigationComponent>;
	let router: Router;

	const idPipe = new IdPipe();
	const versionServiceMock = {setCurrentVersion: jest.fn(), setCmsData: jest.fn(), getBaseUrl: jest.fn(() => '')};
	const cmsDataServiceMock = {
		getCategories: jest.fn(() =>
			of({
				data: [
					{id: 1, name: 'Guidelines', min_version: 9, max_version: 13},
					{id: 2, name: 'Components', min_version: 11},
					{id: 3, name: 'Patterns', min_version: 9, max_version: 13},
				],
			})
		),
		getTabbedPagesShort: jest.fn(() =>
			of({
				data: [
					{
						id: 11,
						name: 'Guideline Page',
						slug: 'guideline-sub-item-1',
						category: 1,
						min_version: 1,
						max_version: 13,
					},
					{
						id: 33,
						name: 'Pattern Page',
						slug: 'pattern-sub-item-1',
						category: 3,
						min_version: 1,
						max_version: 13,
					},
				],
			})
		),
		getTextPagesShort: jest.fn(() =>
			of({
				data: [{id: 22, name: 'Component Page', slug: 'component-sub-item-1', category: 2, min_version: 1}],
			})
		),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				AccordionLinksComponent,
				IdPipe,
				ImageComponent,
				SideNavigationComponent,
				VersionComponent,
			],
			providers: [
				{provide: WINDOW, useValue: window},
				{provide: CmsDataService, useValue: cmsDataServiceMock},
				{provide: VersionService, useValue: versionServiceMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SideNavigationComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);

		fixture.detectChanges();
	});

	afterEach(() => {
		fixture?.destroy();
	});

	describe('on init', () => {
		it.each<{
			id: SideNavigationIds;
		}>([{id: 'accordion-links'}, {id: 'logo'}, {id: 'search-input'}, {id: 'version'}])('should display $id', ({id}) => {
			expect(
				getDebugElementById<SideNavigationComponent>(fixture, idPipe.transform(component.componentId, [id]))
			).toBeTruthy();
		});
	});

	describe('Accordions Versioning', () => {
		it.each([
			{version: 9, expectedTitles: ['guidelines', 'patterns']},
			{version: 11, expectedTitles: ['components', 'guidelines', 'patterns']},
			{version: 14, expectedTitles: ['components']},
		])('should filter accordions for version $version', async ({version, expectedTitles}) => {
			const expectedTitlesKey = expectedTitles.join('|');
			const accordionsForVersionPromise = firstValueFrom(
				component.filteredAccordions$.pipe(
					filter(accordions => {
						const titles = accordions.map(accordion => accordion.title).sort();
						return accordions.length === expectedTitles.length && titles.join('|') === expectedTitlesKey;
					})
				)
			);

			await router.navigateByUrl('/');
			component.updateVersion(version);

			const accordionsForVersion = await accordionsForVersionPromise;
			const titles = accordionsForVersion.map(accordion => accordion.title).sort();
			expect(titles).toEqual(expectedTitles);
		});
	});
});
