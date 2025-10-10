import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionButtonComponent} from './action-button.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('ActionButtonComponent', () => {
	let component: ActionButtonComponent;
	let fixture: ComponentFixture<ActionButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ActionButtonComponent,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ActionButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
