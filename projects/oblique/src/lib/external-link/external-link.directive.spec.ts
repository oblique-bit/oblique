import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {WINDOW} from '../utilities';
import {ObExternalLinkDirective} from './external-link.directive';
import {EXTERNAL_LINK} from './external-link.model';

@Component({
	template: `<a>External Link</a>`
})
class TestInternalComponent {}

@Component({
	template: `<a href="http://www.google.ch">External Link</a>`
})
class TestComponent {}

describe('ObExternalLink', () => {
	let directive: ObExternalLinkDirective;
	let fixture: ComponentFixture<TestComponent | TestInternalComponent>;
	let element: HTMLElement;
	let translate: TranslateService;
	const lang = new Subject<void>();

	describe('Config', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TestComponent, ObExternalLinkDirective],
				providers: [
					{provide: WINDOW, useValue: window},
					{
						provide: TranslateService,
						useValue: {onLangChange: lang, instant: jest.fn().mockReturnValue('Opens in new tab')}
					}
				]
			});
		}));

		describe('Default', () => {
			beforeEach(() => {
				fixture = TestBed.createComponent(TestComponent);
				fixture.detectChanges();
				const debugElement = fixture.debugElement.query(By.directive(ObExternalLinkDirective));
				directive = debugElement.injector.get(ObExternalLinkDirective);
				element = debugElement.nativeElement;
				translate = TestBed.inject(TranslateService);
			});

			it('should have ob-external-link class', () => {
				expect(element.classList.contains('ob-external-link')).toBe(true);
			});

			it('should create an instance', () => {
				expect(directive).toBeTruthy();
			});

			it('should have an aria-label', () => {
				expect(element.getAttribute('aria-label')).toBe('External Link - Opens in new tab');
			});

			it('should translate the aria-label on lang change', () => {
				lang.next();
				expect(translate.instant).toHaveBeenCalled();
			});

			describe('rel attribute', () => {
				it('should be noopener noreferrer when undefined', () => {
					directive.rel = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('rel')).toBe('noopener noreferrer');
				});
				it('should be noopener noreferrer when null', () => {
					directive.rel = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('rel')).toBe('noopener noreferrer');
				});
				it('should not be present if empty', () => {
					directive.rel = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('rel')).toBe(null);
				});
				it('should be the given value', () => {
					directive.rel = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('rel')).toBe('test');
				});
			});

			describe('target attribute', () => {
				it('should be _blank when undefined', () => {
					directive.target = undefined;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('target')).toBe('_blank');
				});
				it('should be _blank when null', () => {
					directive.target = null;
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('target')).toBe('_blank');
				});
				it('should not be present if empty', () => {
					directive.target = '';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('target')).toBe(null);
				});
				it('should be the given value', () => {
					directive.target = 'test';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.getAttribute('target')).toBe('test');
				});
			});

			describe('icon', () => {
				it('should not be added if none', () => {
					directive.icon = 'none';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(element.children.length).toBe(0);
				});

				describe('left', () => {
					let span: HTMLSpanElement;
					beforeEach(() => {
						directive.icon = 'left';
						directive.ngOnChanges();
						fixture.detectChanges();
						span = element.firstChild as HTMLSpanElement;
					});

					it('should have children', () => {
						expect(element.children.length).toBe(1);
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
				});

				describe('right', () => {
					let span: HTMLSpanElement;
					beforeEach(() => {
						directive.icon = 'right';
						directive.ngOnChanges();
						fixture.detectChanges();
						span = element.lastChild as HTMLSpanElement;
					});

					it('should have children', () => {
						expect(element.children.length).toBe(1);
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
				});

				describe('remove', () => {
					it('should not have children', () => {
						directive.icon = 'right';
						directive.ngOnChanges();
						directive.icon = 'none';
						directive.ngOnChanges();
						fixture.detectChanges();
						expect(element.children.length).toBe(0);
					});
				});
			});
		});

		describe('Custom', () => {
			beforeEach(() => {
				TestBed.overrideProvider(EXTERNAL_LINK, {useValue: {rel: 'custom rel', target: 'custom target', icon: 'left'}});
				fixture = TestBed.createComponent(TestComponent);
				fixture.detectChanges();
				element = fixture.debugElement.query(By.directive(ObExternalLinkDirective)).nativeElement;
			});

			it('should have a rel attribute', () => {
				expect(element.getAttribute('rel')).toBe('custom rel');
			});

			it('should have a target attribute', () => {
				expect(element.getAttribute('target')).toBe('custom target');
			});

			it('should have the icon on the left', () => {
				expect(element.firstChild instanceof HTMLSpanElement).toBe(true);
			});
		});
	});

	describe('with internal link', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TestInternalComponent, ObExternalLinkDirective],
				providers: [
					{provide: WINDOW, useValue: window},
					{
						provide: TranslateService,
						useValue: {onLangChange: lang, instant: jest.fn().mockReturnValue('Opens in new tab')}
					}
				]
			});
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(TestInternalComponent);
			fixture.detectChanges();
			const debugElement = fixture.debugElement.query(By.css('a'));
			directive = debugElement.injector.get(ObExternalLinkDirective, null);
			element = debugElement.nativeElement;
			translate = TestBed.inject(TranslateService);
		});

		it('should not have ob-external-link class', () => {
			expect(element.classList.contains('ob-external-link')).toBe(false);
		});

		it('should create an instance', () => {
			expect(fixture.componentInstance).toBeTruthy();
		});

		it('should create an instance', () => {
			expect(directive).toBe(null);
		});

		it('should not translate', () => {
			expect(translate.instant).not.toHaveBeenCalled();
		});

		it('should not have an aria-label attribute', () => {
			expect(element.getAttribute('aria-label')).toBe(null);
		});

		it('should not have a target attribute', () => {
			expect(element.getAttribute('target')).toBe(null);
		});

		it('should not have a rel attribute', () => {
			expect(element.getAttribute('rel')).toBe(null);
		});

		it('should not have an icon', () => {
			expect(element.children.length).toBe(0);
		});
	});
});
