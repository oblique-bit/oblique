import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {WINDOW} from '../utilities';
import {ObUseObliqueIcons} from '../icon/icon.model';
import {ObExternalLinkDirective} from './external-link.directive';
import {EXTERNAL_LINK} from './external-link.model';

@Component({
	template: `<a href="http://www.google.ch">External Link</a>`
})
class TestComponent {}

describe('ObExternalLink', () => {
	let directive: ObExternalLinkDirective;
	let fixture: ComponentFixture<TestComponent>;
	let element: HTMLElement;
	let translate: TranslateService;
	const lang = new Subject<void>();
	const subject = new Subject<string>();

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObExternalLinkDirective],
			providers: [
				{provide: WINDOW, useValue: window},
				{
					provide: TranslateService,
					useValue: {
						onLangChange: lang,
						instant: jest.fn().mockReturnValue('Opens in new tab'),
						stream: () => subject.asObservable()
					}
				},
				{provide: ObUseObliqueIcons, useValue: false}
			]
		});
	});

	describe('With default configuration', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			globalSetup();
			subject.next('Opens in new tab');
			translate = TestBed.inject(TranslateService);
		});

		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should have ob-external-link class', () => {
			expect(element.classList.contains('ob-external-link')).toBe(true);
		});

		describe('additional screen reader element', () => {
			let screenReaderOnlyElement: HTMLSpanElement;
			beforeEach(() => {
				screenReaderOnlyElement = fixture.debugElement.query(By.css('.ob-screen-reader-only')).nativeElement;
			});

			it('should be there', () => {
				expect(screenReaderOnlyElement).toBeTruthy();
			});

			it('should have some content', () => {
				expect(screenReaderOnlyElement.textContent).toBe(' - Opens in new tab');
			});

			it('should follow the actual content immediately', () => {
				expect(element.textContent).toBe('External Link - Opens in new tab');
			});

			it('should translate the screen reader only text on lang change', () => {
				subject.next('Ouvrir dans un nouvel onglet');
				fixture.detectChanges();
				expect(element.textContent).toBe('External Link - Ouvrir dans un nouvel onglet');
			});
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
				expect(fixture.debugElement.query(By.css('.fa-external-link-alt'))).toBeFalsy();
			});

			describe('left', () => {
				let span: HTMLSpanElement;
				beforeEach(() => {
					directive.icon = 'left';
					directive.ngOnChanges();
					fixture.detectChanges();
					span = fixture.debugElement.query(By.css('.fa-external-link-alt')).nativeElement;
				});

				it('should be span', () => {
					expect(span instanceof HTMLSpanElement).toBe(true);
				});

				it('should be the first element', () => {
					expect(span).toBe(element.firstChild);
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
					span = fixture.debugElement.query(By.css('.fa-external-link-alt')).nativeElement;
				});

				it('should be a span', () => {
					expect(span instanceof HTMLSpanElement).toBe(true);
				});

				it('should be the last child', () => {
					expect(span).toBe(element.lastChild);
				});

				it('should have fa class', () => {
					expect(span.classList.contains('fa')).toBe(true);
				});

				it('should have a fa-external-link as class', () => {
					expect(span.classList.contains('fa-external-link-alt')).toBe(true);
				});
			});

			describe('remove', () => {
				it('should not br present in the dom', () => {
					directive.icon = 'none';
					directive.ngOnChanges();
					fixture.detectChanges();
					expect(fixture.debugElement.query(By.css('.fa-external-link-alt'))).toBeFalsy();
				});
			});
		});
	});

	describe('With custom configuration', () => {
		beforeEach(() => {
			TestBed.overrideProvider(EXTERNAL_LINK, {useValue: {rel: 'custom rel', target: 'custom target', icon: 'left'}});
			globalSetup();
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

	describe('with internal link', () => {
		beforeEach(() => {
			TestBed.overrideComponent(TestComponent, {set: {template: `<a>External Link</a>`}});
			globalSetup();
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

		it('should not have a screen reader only element', () => {
			expect(fixture.debugElement.query(By.css('.fa-external-link-alt'))).toBeFalsy();
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

	function globalSetup(): void {
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		const debugElement = fixture.debugElement.query(By.css('a'));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObExternalLinkDirective, null);
	}
});
