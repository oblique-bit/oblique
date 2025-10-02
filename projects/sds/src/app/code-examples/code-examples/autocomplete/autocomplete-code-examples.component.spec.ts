import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {AutocompleteCodeExamplesComponent} from './autocomplete-code-examples.component';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';

describe('AutocompleteCodeExamplesComponent', () => {
	let component: AutocompleteCodeExamplesComponent;
	let fixture: ComponentFixture<AutocompleteCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AutocompleteCodeExamplesComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(AutocompleteCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
