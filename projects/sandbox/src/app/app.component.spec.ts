import {TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {AppComponent} from './app.component';
import {provideNativeDateAdapter} from '@angular/material/core';

describe('AppComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [RouterTestingModule, ObliqueTestingModule],
			providers: [provideNativeDateAdapter()],
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
