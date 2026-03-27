import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TabbedPageComponent} from './tabbed-page.component';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {IdPipe} from '../shared/id/id.pipe';
import {CmsRouteRedirector} from '../shared/cms-route-redirector/cms-route-redirector';

describe(TabbedPageComponent.name, () => {
	let component: TabbedPageComponent;
	let fixture: ComponentFixture<TabbedPageComponent>;
	let service: CmsRouteRedirector;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, IdPipe, RouterTestingModule, TabbedPageComponent, TabsComponent, TabComponent],
			providers: [provideObliqueTestingConfiguration()],
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
