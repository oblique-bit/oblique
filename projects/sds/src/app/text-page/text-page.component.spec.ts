import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {TextPageComponent} from './text-page.component';
import {IdPipe} from '../shared/id/id.pipe';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {CmsRouteRedirector} from '../shared/cms-route-redirector/cms-route-redirector';

describe(TextPageComponent.name, () => {
	let component: TextPageComponent;
	let fixture: ComponentFixture<TextPageComponent>;
	let service: CmsRouteRedirector;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				IdPipe,
				RouterModule.forRoot([{path: '**', component: TextPageComponent}]),
				TextPageComponent,
			],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(TextPageComponent);
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
		describe.each([
			{name: 'document', node: document},
			{name: 'window', node: window},
			{name: 'div', node: document.createElement('div')},
		])('target is not an anchor ($name)', ({node}) => {
			const event = {target: node, preventDefault: jest.fn()} as unknown as PointerEvent;
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

		describe('target is within an anchor', () => {
			let event: PointerEvent;
			const anchor = document.createElement('a');
			const span = document.createElement('span');
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			anchor.href = 'http://localhost/about';

			describe.each([
				{name: 'anchor', element: anchor},
				{name: 'span', element: span},
				{name: 'svg', element: svg},
			])('target is within an anchor ($name)', ({element}) => {
				beforeEach(() => {
					anchor.appendChild(span);
					anchor.appendChild(svg);
					anchor.href = 'http://localhost/about';
					event = {target: element, preventDefault: jest.fn()} as unknown as PointerEvent;
					component.onClick(event);
				});

				it('should prevent default', () => {
					expect(event.preventDefault).toHaveBeenCalled();
				});
				it('should navigate', () => {
					expect(service.navigate).toHaveBeenCalledWith(anchor.origin, anchor.href);
				});
			});
		});
	});
});
