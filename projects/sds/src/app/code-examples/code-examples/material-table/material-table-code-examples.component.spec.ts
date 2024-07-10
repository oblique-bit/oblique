import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {MaterialTableCodeExamplesComponent} from './material-table-code-examples.component';
import {ObMockTranslateService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(MaterialTableCodeExamplesComponent.name, () => {
	let component: MaterialTableCodeExamplesComponent;
	let fixture: ComponentFixture<MaterialTableCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialTableCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(MaterialTableCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
