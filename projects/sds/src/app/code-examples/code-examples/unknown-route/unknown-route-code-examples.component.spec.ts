import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {UnknownRouteCodeExamplesComponent} from './unknown-route-code-examples.component';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ObMockTranslateService} from '@oblique/oblique';

describe(UnknownRouteCodeExamplesComponent.name, () => {
	let component: UnknownRouteCodeExamplesComponent;
	let fixture: ComponentFixture<UnknownRouteCodeExamplesComponent>;

	beforeEach(async () => {
		const staticRouteMock = {
			root: {
				path: 'unknown-route'
			}
		};
		await TestBed.configureTestingModule({
			imports: [UnknownRouteCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ActivatedRoute, useValue: staticRouteMock}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UnknownRouteCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
