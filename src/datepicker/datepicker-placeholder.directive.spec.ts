import {TestBed, ComponentFixture, async, inject} from '@angular/core/testing';
import {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {Component, EventEmitter, DebugElement} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {By} from '@angular/platform-browser';

@Component({
	template: `<input ngbDatepicker />`
})
class TestComponent {
}

describe('DatepickerPlaceholderDirective', () => {
	let testComponent: TestComponent;
	let directive: DatepickerPlaceholderDirective;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;

	const I18N_PLACEHOLDERS = {
		en: 'dd.mm.yyyy',
		fr: 'jj.mm.aaaa',
		de: 'TT.MM.JJJJ',
		it: 'gg.mm.aaaa'
	};

	function createFixture() {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(DatepickerPlaceholderDirective));
		directive = element.injector.get(DatepickerPlaceholderDirective);
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				DatepickerPlaceholderDirective
			],
			imports: [],
			providers: [
				{
					provide: TranslateService, useValue: {
					currentLang: 'en',
					onLangChange: new EventEmitter<LangChangeEvent>()
				}
				}
			]
		});
	}));

	describe('without a custom placeholder', () => {
		beforeEach(() => {
			createFixture();
		});

		it('should set a placeholder on the input element', () => {
			expect(element.properties['placeholder']).toBeDefined();
		});

		it('should set the placeholder for the current lang', () => {
			expect(element.properties['placeholder']).toBe(I18N_PLACEHOLDERS['en']);
		});

		it('should change the placeholder onLangChange', inject([TranslateService], (translateService) => {
			translateService.onLangChange.emit({lang: 'de'});

			fixture.detectChanges();

			expect(element.properties['placeholder']).toBe(I18N_PLACEHOLDERS['de']);
		}));
	});

	describe('with a custom placeholder', () => {
		beforeEach(async(() => {
			TestBed.overrideTemplate(TestComponent, `<input ngbDatepicker placeholder="custom"/>`);
			createFixture();
		}));

		it('shouldn\'t change the placeholder', () => {
			expect(element.properties['placeholder']).toBe('custom');
		});

		it('shouldn\'t change the placeholder onLangChange', inject([TranslateService], (translateService) => {
			translateService.onLangChange.emit({lang: 'de'});

			fixture.detectChanges();

			expect(element.properties['placeholder']).toBe('custom');
		}));
	});
});
