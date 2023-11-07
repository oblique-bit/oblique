import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObDisableLinkDirective} from './disable-link.directive';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@Component({
	standalone: true,
	imports: [ObDisableLinkDirective],
	template: `
		<a [id]="standardId" [obDisableLink]="disableLink" [href]="randomurl">randomlink</a>
		<a [id]="defaultId" obDisableLink [href]="randomurl">randomlink</a>
	`
})
export class ObTestingComponent {
	disableLink = true;
	randomurl = 'randomurl';
	standardId = 'standard';
	defaultId = 'default';
}

describe('obDisableLinkDirective', () => {
	let fixture: ComponentFixture<ObTestingComponent>;
	let component: ObTestingComponent;
	let element: HTMLElement;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [CommonModule, NoopAnimationsModule, ObDisableLinkDirective, ObTestingComponent]
		});

		fixture = TestBed.createComponent(ObTestingComponent);
		component = fixture.componentInstance;
	});

	describe('condition is true', () => {
		beforeEach(() => {
			component.disableLink = true;
			fixture.detectChanges();
			element = fixture.nativeElement.querySelector(`#${component.standardId}`);
		});

		it('should set role=link', () => {
			expect(element.getAttribute('role')).toBe('link');
		});

		it('should remove href', () => {
			expect(element.hasAttribute('href')).toBe(false);
		});

		it('should set aria-disabled', () => {
			expect(element.getAttribute('aria-disabled')).toBe('true');
		});
	});

	describe('condition is false', () => {
		beforeEach(() => {
			component.disableLink = false;
			fixture.detectChanges();
			element = fixture.nativeElement.querySelector(`#${component.standardId}`);
		});

		it('should remove role=link', () => {
			expect(element.hasAttribute('role')).toBe(false);
		});

		it("should have href with component's randomurl value", () => {
			expect(element.getAttribute('href')).toBe(component.randomurl);
		});

		it('should remove aria-disabled', () => {
			expect(element.hasAttribute('aria-disabled')).toBe(false);
		});
	});

	describe('no condition given', () => {
		beforeEach(() => {
			component.disableLink = false;
			fixture.detectChanges();
			element = fixture.nativeElement.querySelector(`#${component.defaultId}`);
		});

		it('should remove href', () => {
			expect(element.hasAttribute('href')).toBe(false);
		});
	});

	describe('ngOnChanges', () => {
		describe('condition goes from true to false', () => {
			it('should not have role=link', () => {
				component.disableLink = true;
				fixture.detectChanges();
				component.disableLink = false;
				fixture.detectChanges();

				element = fixture.nativeElement.querySelector(`#${component.standardId}`);
				expect(element.hasAttribute('role')).toBe(false);
			});
		});

		describe('condition goes from false to true', () => {
			it('should have have role=link', () => {
				component.disableLink = false;
				fixture.detectChanges();
				component.disableLink = true;
				fixture.detectChanges();

				element = fixture.nativeElement.querySelector(`#${component.standardId}`);
				expect(element.hasAttribute('role')).toBe(true);
			});
		});
	});
});
