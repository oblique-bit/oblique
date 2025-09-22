import {TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

describe('AppComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [RouterTestingModule, TranslateModule],
			providers: [provideNativeDateAdapter(), provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		});
		TestBed.compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
