import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TextPageComponent} from './text-page.component';
import {IdPipe} from '../shared/id/id.pipe';
import {Router} from '@angular/router';

describe(TextPageComponent.name, () => {
	let component: TextPageComponent;
	let fixture: ComponentFixture<TextPageComponent>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, IdPipe, RouterTestingModule, TextPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TextPageComponent);
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
			const event = {target: document.createElement('div'), preventDefault: jest.fn()} as unknown as MouseEvent;
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
			let event: MouseEvent;
			beforeEach(() => {
				const anchor = document.createElement('a');
				anchor.href = `${window.location.origin}/about`;
				anchor.hash = '';
				event = {target: anchor, preventDefault: jest.fn()} as unknown as MouseEvent;
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

		describe('target is an internal link with a fragment', () => {
			let event: MouseEvent;
			beforeEach(() => {
				const anchor = document.createElement('a');
				anchor.href = `${window.location.origin}/about#section`;
				anchor.hash = '#section';
				event = {target: anchor, preventDefault: jest.fn()} as unknown as MouseEvent;
				component.onClick(event);
			});
			it('should prevent default', () => {
				expect(event.preventDefault).toHaveBeenCalled();
			});
			it('should navigate internally', () => {
				expect(router.navigate).toHaveBeenCalledWith(['/about'], {fragment: 'section'});
			});
			it('should not open a new tab', () => {
				expect(window.open).not.toHaveBeenCalled();
			});
		});

		describe('target is an external link', () => {
			let event: MouseEvent;
			beforeEach(() => {
				const anchor = document.createElement('a');
				anchor.href = 'https://external.com';
				event = {target: anchor, preventDefault: jest.fn()} as unknown as MouseEvent;
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
