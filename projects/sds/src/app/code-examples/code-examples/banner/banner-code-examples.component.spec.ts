import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {BannerCodeExamplesComponent} from './banner-code-examples.component';
import {By} from '@angular/platform-browser';
import {ObButtonDirective, ObMockTranslateService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';

describe(BannerCodeExamplesComponent.name, () => {
	let component: BannerCodeExamplesComponent;
	let fixture: ComponentFixture<BannerCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BannerCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(BannerCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${ObButtonDirective.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(1);
	});

	test(`that there is 1 link to stackblitz`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="stackblitz"]')).length).toBe(1);
	});

	test(`that there is 1 link to banner`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="banner"]')).length).toBe(1);
	});
});
