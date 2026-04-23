import {TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [RouterModule.forRoot([{path: '**', component: AppComponent}]), TranslateModule],
			providers: [provideNativeDateAdapter(), provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
