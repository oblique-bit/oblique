import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconRegistry} from '@angular/material/icon';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subject, of} from 'rxjs';
import {WINDOW} from '../window/window.provider';
import {ObExternalLinkDirective} from './external-link.directive';
import {EXTERNAL_LINK} from './external-link.model';

@Component({
	standalone: false,
	template: `<a href="http://www.google.ch" [icon]="icon()">External Link</a>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponent {
	href = signal('');
}

@Component({
	imports: [ObExternalLinkDirective],
	standalone: true,
	template: `<a href="http://www.google.ch" [icon]="icon()" [rel]="rel()" [target]="target()">External Link</a>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class BoundAttributeTestComponent {
	icon = signal<string | null | undefined>(undefined);
	rel = signal<string | null | undefined>(undefined);
	target = signal<string | null | undefined>(undefined);
	isExternalLink = signal<boolean | 'auto'>(false);
}

describe(ObExternalLinkDirective.name, () => {
	let directive: ObExternalLinkDirective;
	let fixture: ComponentFixture<TestComponent | BoundAttributeTestComponent>;
	let element: HTMLElement;
	let translate: TranslateService;
	const lang = new Subject<void>();
	const subject = new Subject<string>();

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObExternalLinkDirective],
			declarations: [TestComponent],
			providers: [
				{provide: WINDOW, useValue: window},
				{
					provide: MatIconRegistry,
					useValue: {getNamedSvgIcon: jest.fn().mockReturnValue(of(document.createElement('svg')))},
				},
				{
					provide: TranslateService,
					useValue: {
						onLangChange: lang,
						instant: jest.fn().mockReturnValue('Opens in new tab'),
						stream: () => subject.asObservable(),
					},
				},
			],
		});
	});

	describe('With default configuration', () => {
		beforeEach(() => {
			globalSetupBoundAttributeTestComponent();
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
			beforeEach(() => {
				fixture = TestBed.createComponent(BoundAttributeTestComponent);
				fixture.detectChanges();
				const debugElement = fixture.debugElement.query(By.css('a'));
				element = debugElement.nativeElement;
			});

			it('should be noopener noreferrer when undefined', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).rel.set(undefined);
				fixture.detectChanges();
				expect(element.getAttribute('rel')).toBe('noopener noreferrer');
			});
			it('should be noopener noreferrer when null', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).rel.set(null);
				fixture.detectChanges();
				expect(element.getAttribute('rel')).toBe('noopener noreferrer');
			});
			it('should not be present if empty', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).rel.set('');
				fixture.detectChanges();
				expect(element.getAttribute('rel')).toBe(null);
			});
			it('should be the given value', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).rel.set('test');
				fixture.detectChanges();
				expect(element.getAttribute('rel')).toBe('test');
			});
		});

		describe('target attribute', () => {
			beforeEach(() => {
				fixture = TestBed.createComponent(BoundAttributeTestComponent);
				fixture.detectChanges();
				const debugElement = fixture.debugElement.query(By.css('a'));
				element = debugElement.nativeElement;
			});

			it('should be _blank when undefined', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).target.set(undefined);
				fixture.detectChanges();
				expect(element.getAttribute('target')).toBe('_blank');
			});
			it('should be _blank when null', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).target.set(null);
				fixture.detectChanges();
				expect(element.getAttribute('target')).toBe('_blank');
			});
			it('should not be present if empty', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).target.set('');
				fixture.detectChanges();
				expect(element.getAttribute('target')).toBe(null);
			});
			it('should be the given value', () => {
				(fixture.componentInstance as BoundAttributeTestComponent).target.set('test');
				fixture.detectChanges();
				expect(element.getAttribute('target')).toBe('test');
			});
		});

		describe('icon', () => {
			describe('none', () => {
				it('should not be added if none', () => {
					fixture = TestBed.createComponent(BoundAttributeTestComponent);
					(fixture.componentInstance as BoundAttributeTestComponent).icon.set('none');
					fixture.detectChanges();
					expect(fixture.debugElement.query(By.css('.mat-icon'))).toBeFalsy();
				});
			});

			describe('left', () => {
				let span: HTMLSpanElement;
				beforeEach(() => {
					fixture = TestBed.createComponent(BoundAttributeTestComponent);
					(fixture.componentInstance as BoundAttributeTestComponent).icon.set('left');
					fixture.detectChanges();
					const debugElement = fixture.debugElement.query(By.css('a'));
					element = debugElement.nativeElement;
					span = fixture.debugElement.query(By.css('.mat-icon')).nativeElement;
				});

				it('should be span', () => {
					expect(span instanceof HTMLSpanElement).toBe(true);
				});

				it('should be the first element', () => {
					expect(span).toBe(element.firstChild);
				});
			});

			describe('right', () => {
				let span: HTMLSpanElement;

				beforeEach(() => {
					fixture = TestBed.createComponent(BoundAttributeTestComponent);
					(fixture.componentInstance as BoundAttributeTestComponent).icon.set('right');
					fixture.detectChanges();
					const debugElement = fixture.debugElement.query(By.css('a'));
					element = debugElement.nativeElement;
					span = fixture.debugElement.query(By.css('.mat-icon')).nativeElement;
				});

				it('should be a span', () => {
					expect(span instanceof HTMLSpanElement).toBe(true);
				});

				it('should be the last child', () => {
					expect(span).toBe(element.lastChild);
				});
			});

			describe('remove', () => {
				it('should not br present in the dom', () => {
					fixture = TestBed.createComponent(BoundAttributeTestComponent);
					(fixture.componentInstance as BoundAttributeTestComponent).icon.set('none');
					fixture.detectChanges();
					expect(fixture.debugElement.query(By.css('.mat-icon'))).toBeFalsy();
				});
			});
		});

		describe('markup with no icon', () => {
			beforeEach(() => {
				directive.icon = 'none';
				directive.ngOnChanges();
				fixture.detectChanges();
			});

			it('should contain 2 nodes', () => {
				expect(element.childNodes.length).toBe(2);
			});

			it('should have the original text in first position', () => {
				expect(element.firstChild instanceof Text).toBe(true);
			});

			it('should have the screen reader only element in second position', () => {
				expect((element.lastChild as HTMLSpanElement).classList.contains('ob-screen-reader-only')).toBe(true);
			});
		});

		describe('markup with left icon', () => {
			beforeEach(() => {
				fixture = TestBed.createComponent(BoundAttributeTestComponent);
				(fixture.componentInstance as BoundAttributeTestComponent).icon.set('left');
				fixture.detectChanges();
				const debugElement = fixture.debugElement.query(By.css('a'));
				element = debugElement.nativeElement;
			});

			it('should contain 3 nodes', () => {
				expect(element.childNodes.length).toBe(3);
			});

			it('should have icon element in first position', () => {
				expect((element.firstChild as HTMLSpanElement).classList.contains('mat-icon')).toBe(true);
			});

			it('should have the original text in second position ', () => {
				expect(element.childNodes[1] instanceof Text).toBe(true);
			});

			it('should have the screen reader only element in last position', () => {
				expect((element.lastChild as HTMLSpanElement).classList.contains('ob-screen-reader-only')).toBe(true);
			});
		});

		describe('markup with right icon', () => {
			beforeEach(() => {
				fixture = TestBed.createComponent(BoundAttributeTestComponent);
				(fixture.componentInstance as BoundAttributeTestComponent).icon.set('right');
				fixture.detectChanges();
			});

			it('should contain 3 nodes', () => {
				expect(element.childNodes.length).toBe(3);
			});

			it('should have the original text in first position', () => {
				expect(element.firstChild instanceof Text).toBe(true);
			});

			it('should have the screen reader only element in first position', () => {
				expect((element.childNodes[1] as HTMLSpanElement).classList.contains('ob-screen-reader-only')).toBe(true);
			});

			it('should have the icon element in last position', () => {
				expect((element.lastChild as HTMLSpanElement).classList.contains('mat-icon')).toBe(true);
			});
		});
	});

	describe('With custom configuration', () => {
		beforeEach(() => {
			TestBed.overrideTemplate(TestComponent, '<a>Link</a>');
			TestBed.overrideProvider(EXTERNAL_LINK, {
				useValue: {rel: 'custom rel', target: 'custom target', icon: 'left', isExternalLink: true},
			});
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

		it('should have the "ob-external-link" class', () => {
			expect(element.classList).toContain('ob-external-link');
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

		it('should create a component instance', () => {
			expect(fixture.componentInstance).toBeTruthy();
		});

		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should not translate', () => {
			expect(translate.instant).not.toHaveBeenCalled();
		});

		it('should not have a screen reader only element', () => {
			expect(fixture.debugElement.query(By.css('.ob-screen-reader-only'))).toBeFalsy();
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

	describe('with dynamic link', () => {
		beforeEach(() => {
			TestBed.overrideComponent(TestComponent, {set: {template: `<a [href]="href">Dynamic Link</a>`}});
			fixture = TestBed.createComponent(TestComponent);
		});

		test.each([
			{case: 'internal link', href: 'http://localhost:3001', isExternal: true},
			{case: 'internal link', href: 'http://localhost', isExternal: false},
			{case: 'external link', href: 'http://www.google.ch/', isExternal: true},
			{case: 'internal link with href internal', href: 'internal', isExternal: false},
			{case: 'internal link with href /', href: '/', isExternal: false},
			{case: 'internal link without href', href: '', isExternal: false},
			{case: 'internal link with href /internal', href: '/internal', isExternal: false},
		])('$case', ({href, isExternal}) => {
			(fixture.componentInstance as TestComponent).href = href;
			const debugElement = fixture.debugElement.query(By.css('a'));
			element = debugElement.nativeElement;
			fixture.detectChanges();
			expect(element.classList.contains('ob-external-link')).toBe(isExternal);
		});
	});

	describe('with isExternalLink', () => {
		beforeEach(() => {
			TestBed.overrideComponent(BoundAttributeTestComponent, {
				set: {template: `<a href="http://www.google.ch" [isExternalLink]="isExternalLink()">External Link</a>`},
			});
			fixture = TestBed.createComponent(BoundAttributeTestComponent);
			fixture.detectChanges();
			const debugElement = fixture.debugElement.query(By.css('a'));
			element = debugElement.nativeElement;
			directive = debugElement.injector.get(ObExternalLinkDirective);
		});

		it('isLinkExternal should be true when isExternalLink is true', () => {
			(fixture.componentInstance as BoundAttributeTestComponent).isExternalLink.set(true);
			fixture.detectChanges();
			expect(directive.isLinkExternal).toBe(true);
		});

		it('isLinkExternal should be false when isExternalLink is false', () => {
			(fixture.componentInstance as BoundAttributeTestComponent).isExternalLink.set(false);
			fixture.detectChanges();
			expect(directive.isLinkExternal).toBe(false);
		});
	});

	function globalSetup(): void {
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		const debugElement = fixture.debugElement.query(By.css('a'));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObExternalLinkDirective);
		translate = TestBed.inject(TranslateService);
	}

	function globalSetupBoundAttributeTestComponent(): void {
		fixture = TestBed.createComponent(BoundAttributeTestComponent);
		fixture.detectChanges();
		const debugElement = fixture.debugElement.query(By.css('a'));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObExternalLinkDirective);
		translate = TestBed.inject(TranslateService);
	}
});
