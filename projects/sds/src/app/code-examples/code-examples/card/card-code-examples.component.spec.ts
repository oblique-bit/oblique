import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CardCodeExamplesComponent} from './card-code-examples.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService, WINDOW} from '@oblique/oblique';

describe('CardCodeExamplesComponent', () => {
	let component: CardCodeExamplesComponent;
	let fixture: ComponentFixture<CardCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardCodeExamplesComponent, RouterTestingModule],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CardCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
