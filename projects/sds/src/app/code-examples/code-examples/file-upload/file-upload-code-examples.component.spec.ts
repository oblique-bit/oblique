import {ObFileInfoComponent} from '../../../../../../oblique/src/lib/file-upload/file-info/file-info.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FileUploadCodeExamplesComponent} from './file-upload-code-examples.component';
import {ObDropZoneComponent, ObFileUploadComponent, ObMockTranslatePipe, ObMockTranslateService, WINDOW} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';
import {By} from '@angular/platform-browser';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(FileUploadCodeExamplesComponent.name, () => {
	let component: FileUploadCodeExamplesComponent;
	let fixture: ComponentFixture<FileUploadCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObMockTranslatePipe,
				CodeExampleComponent,
				CommonModule,
				FileUploadCodeExamplesComponent,
				HttpClientTestingModule,
				IdPipe,
				NoopAnimationsModule
			],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(FileUploadCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	it(`should have 6 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(6);
	});

	it(`should have 10 ${ObFileUploadComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObFileUploadComponent)).length).toBe(10);
	});

	it(`should have 3 ${ObFileInfoComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObFileInfoComponent)).length).toBe(3);
	});

	it(`should have 11 ${ObDropZoneComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObDropZoneComponent)).length).toBe(11);
	});
});
