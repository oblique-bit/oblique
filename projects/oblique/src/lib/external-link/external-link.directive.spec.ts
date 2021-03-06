import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject} from 'rxjs';
import {WINDOW, windowProvider} from '../utilities';
import {ObExternalLinkDirective} from './external-link.directive';
import {EXTERNAL_LINK} from './external-link.model';

@Component({
	template: `<a href="http://www.google.ch">External Link</a>`
})
class TestComponent {}

describe('ExternalLink', () => {
	let directive: ObExternalLinkDirective;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	const lang = new Subject<void>();
	const mock = jest.fn();

	describe('With default config', () => {
		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					declarations: [TestComponent, ObExternalLinkDirective],
					providers: [
						{provide: WINDOW, useFactory: windowProvider},
						{provide: TranslateService, useValue: {onLangChange: lang, instant: mock.mockReturnValue('Opens in new tab')}}
					]
				});
			})
		);

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObExternalLinkDirective));
			directive = element.injector.get(ObExternalLinkDirective);
		});

		describe('external link', () => {
			it('should create an instance', () => {
				expect(directive).toBeTruthy();
			});

			it('should have a class', () => {
				expect(element.classes['ob-external-link']).toBe(true);
			});

			it('should have an aria-label', () => {
				expect(element.attributes['aria-label']).toBe('External Link - Opens in new tab');
			});

			it('should translate the aria-label on lang change', () => {
				lang.next();
				expect(mock).toHaveBeenCalled();
			});

			describe('rel attribute', () => {
				it('should be nooper norefer when undefined', () => {
					directive.rel = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe('noopener noreferrer');
				});
				it('should be nooper norefer when null', () => {
					directive.rel = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe('noopener noreferrer');
				});
				it('should not be present if empty', () => {
					directive.rel = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe(null);
				});
				it('should be the given value', () => {
					directive.rel = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe('test');
				});
			});

			describe('target attribute', () => {
				it('should be _blank when undefined', () => {
					directive.target = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe('_blank');
				});
				it('should be _blank when null', () => {
					directive.target = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe('_blank');
				});
				it('should not be present if empty', () => {
					directive.target = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe(null);
				});
				it('should be the given value', () => {
					directive.target = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe('test');
				});
			});

			describe('icon', () => {
				it('should not be added if none', () => {
					directive.icon = 'none';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.nativeElement.children.length).toBe(0);
				});

				describe('left', () => {
					let span: HTMLSpanElement;
					beforeEach(() => {
						directive.icon = 'left';
						directive.ngOnChanges();
						fixture.detectChanges();
						span = element.nativeElement.firstChild;
					});

					it('should have children', () => {
						expect(element.nativeElement.children.length).toBe(1);
					});

					it('should have a span as first child', () => {
						expect(span instanceof HTMLSpanElement).toBe(true);
					});

					it('should have fa class', () => {
						expect(span.classList.contains('fa')).toBe(true);
					});

					it('should have a fa-external-link as class', () => {
						expect(span.classList.contains('fa-external-link-alt')).toBe(true);
					});

					it('should have a margin-right', () => {
						expect(span.style[0]).toBe('margin-right');
					});
				});

				describe('right', () => {
					let span: HTMLSpanElement;
					beforeEach(() => {
						directive.icon = 'right';
						directive.ngOnChanges();
						fixture.detectChanges();
						span = element.nativeElement.lastChild;
					});

					it('should have children', () => {
						expect(element.nativeElement.children.length).toBe(1);
					});

					it('should have a span as first child', () => {
						expect(span instanceof HTMLSpanElement).toBe(true);
					});

					it('should have fa class', () => {
						expect(span.classList.contains('fa')).toBe(true);
					});

					it('should have a fa-external-link as class', () => {
						expect(span.classList.contains('fa-external-link-alt')).toBe(true);
					});

					it('should have a margin-left', () => {
						expect(span.style[0]).toBe('margin-left');
					});
				});

				describe('remove', () => {
					it('should', () => {
						directive.icon = 'right';
						directive.ngOnChanges();
						directive.icon = 'none';
						directive.ngOnChanges();
						fixture.detectChanges();
						expect(element.nativeElement.children.length).toBe(0);
					});
				});
			});
		});

		describe('internal link', () => {
			beforeEach(() => {
				directive.href = window.location.hostname;
				directive.ngOnChanges();
				fixture.detectChanges();
				mock.mockReset();
			});

			it('should create an instance', () => {
				expect(directive).toBeTruthy();
			});

			it('should not have a class', () => {
				expect(element.classes['ob-external-link']).toBe(false);
			});

			it('should not have an aria-label', () => {
				expect(element.attributes['aria-label']).toBeUndefined();
			});

			it('should not translate the aria-label on lang change', () => {
				lang.next();
				expect(mock).not.toHaveBeenCalled();
			});

			describe('rel attribute', () => {
				it('should be null when undefined', () => {
					directive.rel = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe(null);
				});
				it('should be null when null', () => {
					directive.rel = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe(null);
				});
				it('should be empty when empty', () => {
					directive.rel = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe('');
				});
				it('should be the given value', () => {
					directive.rel = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.rel).toBe('test');
				});
			});

			describe('target attribute', () => {
				it('should be null when undefined', () => {
					directive.target = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe(null);
				});
				it('should be null when null', () => {
					directive.target = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe(null);
				});
				it('should not be empty if empty', () => {
					directive.target = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe('');
				});
				it('should be the given value', () => {
					directive.target = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.attributes.target).toBe('test');
				});
			});

			describe('icon', () => {
				it('should not be added if set on none', () => {
					directive.icon = 'none';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.nativeElement.children.length).toBe(0);
				});
				it('should not be added if set on left', () => {
					directive.icon = 'left';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.nativeElement.children.length).toBe(0);
				});
				it('should not be added if set on right', () => {
					directive.icon = 'right';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.nativeElement.children.length).toBe(0);
				});
			});
		});
	});

	describe('with custom config', () => {
		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					declarations: [TestComponent, ObExternalLinkDirective],
					providers: [
						{provide: WINDOW, useFactory: windowProvider},
						{provide: TranslateService, useValue: {onLangChange: lang, instant: mock.mockReturnValue('Opens in new tab')}},
						{provide: EXTERNAL_LINK, useValue: {rel: 'custom rel', target: 'custom target', icon: 'left'}}
					]
				});
			})
		);

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObExternalLinkDirective));
			directive = element.injector.get(ObExternalLinkDirective);
		});

		it('should have a rel attribute', () => {
			expect(element.attributes.rel).toBe('custom rel');
		});

		it('should have a target attribute', () => {
			expect(element.attributes.target).toBe('custom target');
		});

		it('should have the icon on the left', () => {
			expect(element.nativeElement.firstChild instanceof HTMLSpanElement).toBe(true);
		});
	});
});
