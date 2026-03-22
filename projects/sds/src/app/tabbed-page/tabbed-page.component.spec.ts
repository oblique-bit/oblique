import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TabbedPageComponent} from './tabbed-page.component';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {IdPipe} from '../shared/id/id.pipe';
import {Router} from '@angular/router';

describe(TabbedPageComponent.name, () => {
	let component: TabbedPageComponent;
	let fixture: ComponentFixture<TabbedPageComponent>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, IdPipe, RouterTestingModule, TabbedPageComponent, TabsComponent, TabComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TabbedPageComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onClick', () => {
		beforeEach(() => {
			jest.spyOn(router, 'navigate');
			jest.spyOn(window, 'open');
		});
		describe('target is not an anchor', () => {
			const event = {target: document.createElement('div'), preventDefault: jest.fn()} as unknown as PointerEvent;
			beforeEach(() => {
				component.onClick(event);
			});
			it('should not prevent default', () => {
				expect(event.preventDefault).not.toHaveBeenCalled();
			});
			it('should not navigate', () => {
				expect(router.navigate).not.toHaveBeenCalled();
			});
			it('should not open a new tab', () => {
				expect(window.open).not.toHaveBeenCalled();
			});
		});

		describe('target is an internal link', () => {
			let event: PointerEvent;
			beforeEach(() => {
				const anchor = document.createElement('a');
				anchor.href = `${window.location.origin}/about`;
				anchor.hash = '';
				event = {target: anchor, preventDefault: jest.fn()} as unknown as PointerEvent;
				component.onClick(event);
			});
			it('should prevent default', () => {
				expect(event.preventDefault).toHaveBeenCalled();
			});
			it('should navigate internally', () => {
				expect(router.navigate).toHaveBeenCalledWith(['/about']);
			});
			it('should not open a new tab', () => {
				expect(window.open).not.toHaveBeenCalled();
			});
		});

		describe('target is an external link', () => {
			let event: PointerEvent;
			beforeEach(() => {
				const anchor = document.createElement('a');
				anchor.href = 'https://external.com';
				event = {target: anchor, preventDefault: jest.fn()} as unknown as PointerEvent;
				component.onClick(event);
			});
			it('should prevent default', () => {
				expect(event.preventDefault).toHaveBeenCalled();
			});
			it('should not navigate internally', () => {
				expect(router.navigate).not.toHaveBeenCalled();
			});
			it('should not open a new tab', () => {
				expect(window.open).toHaveBeenCalledWith('https://external.com/', '_blank', 'noopener,noreferrer');
			});
		});
	});
});
