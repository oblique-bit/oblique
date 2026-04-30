import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, RouterModule, convertToParamMap} from '@angular/router';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TabbedPageComponent} from './tabbed-page.component';
import {firstValueFrom, of} from 'rxjs';
import {CmsDataService} from '../cms/cms-data.service';
import {VersionService} from '../shared/version/version.service';
import {SlugToIdService} from '../shared/slug-to-id/slug-to-id.service';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {IdPipe} from '../shared/id/id.pipe';
import {CmsRouteRedirector} from '../shared/cms-route-redirector/cms-route-redirector';

describe(TabbedPageComponent.name, () => {
	let component: TabbedPageComponent;
	let fixture: ComponentFixture<TabbedPageComponent>;
	let service: CmsRouteRedirector;
	let currentSlug = 'icons-14';
	const cmsDataServiceMock = {
		getTabbedPageComplete: jest.fn(() =>
			of({
				data: {
					id: 123,
					name: 'Icons',
					slug: currentSlug,
				},
			})
		),
	};
	const slugToIdServiceMock = {
		readyToMap: of(undefined),
		getIdForSlug: jest.fn(() => 123),
	};
	const versionServiceMock = {
		getBaseUrl: jest.fn(() => ''),
	};
	const activatedRouteMock = {
		snapshot: {
			paramMap: convertToParamMap({selectedSlug: 'icons-14'}),
			fragment: null,
		},
		parent: {},
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		currentSlug = 'icons-14';

		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				IdPipe,
				RouterModule.forRoot([{path: '**', component: TabbedPageComponent}]),
				TabbedPageComponent,
				TabsComponent,
				TabComponent,
			],
			providers: [
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: CmsDataService, useValue: cmsDataServiceMock},
				{provide: SlugToIdService, useValue: slugToIdServiceMock},
				{provide: VersionService, useValue: versionServiceMock},
				provideObliqueTestingConfiguration(),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TabbedPageComponent);
		component = fixture.componentInstance;
		service = TestBed.inject(CmsRouteRedirector);
		jest.spyOn(service, 'redirectOnVersionChange').mockImplementation(() => {});
		jest.spyOn(service, 'navigate');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show the gallery tab for the versioned icons page', async () => {
		await firstValueFrom(component.cmsData$);

		expect(component.showGalleryTab).toBe(true);
		expect(cmsDataServiceMock.getTabbedPageComplete).toHaveBeenCalledWith(123);
	});

	it.each(['icons', 'icons-14', 'icons-21', 'icons-999'])('should show the gallery tab for slug "%s"', async slug => {
		currentSlug = slug;

		await firstValueFrom(component.cmsData$);

		expect(component.showGalleryTab).toBe(true);
	});

	it.each(['icon', 'icons-', 'icons14', 'preicons-14', 'icons-14-extra', 'icons/14'])(
		'should not show the gallery tab for the invalid slug: "%s"',
		async slug => {
			currentSlug = slug;

			await firstValueFrom(component.cmsData$);

			expect(component.showGalleryTab).toBe(false);
		}
	);

	describe('onClick', () => {
		describe('target is not an anchor', () => {
			const event = {target: document.createElement('div'), preventDefault: jest.fn()} as unknown as PointerEvent;
			beforeEach(() => {
				component.onClick(event);
			});
			it('should not prevent default', () => {
				expect(event.preventDefault).not.toHaveBeenCalled();
			});
			it('should not navigate', () => {
				expect(service.navigate).not.toHaveBeenCalled();
			});
		});

		describe('target is a link', () => {
			let event: PointerEvent;
			const anchor = document.createElement('a');
			beforeEach(() => {
				event = {target: anchor, preventDefault: jest.fn()} as unknown as PointerEvent;
				anchor.href = 'http://localhost/about';
				component.onClick(event);
			});
			it('should prevent default', () => {
				expect(event.preventDefault).toHaveBeenCalled();
			});
			it('should navigate internally', () => {
				expect(service.navigate).toHaveBeenCalledWith(anchor.origin, anchor.pathname);
			});
		});
	});
});
