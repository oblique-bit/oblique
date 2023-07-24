import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertCodeExamplesComponent} from './alert-code-examples.component';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';

describe(`${AlertCodeExamplesComponent.name}`, () => {
	let component: AlertCodeExamplesComponent;
	let fixture: ComponentFixture<AlertCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AlertCodeExamplesComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(AlertCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
