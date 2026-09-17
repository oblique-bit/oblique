import {CommonModule} from '@angular/common';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {VersionExampleDefaultPreviewComponent} from './previews/default/version-example-default-preview.component';
import {VersionCodeExamplesComponent} from './version-code-examples.component';

describe(VersionCodeExamplesComponent.name, () => {
	let component: VersionCodeExamplesComponent;
	let fixture: ComponentFixture<VersionCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VersionCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(VersionCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${VersionExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(VersionExampleDefaultPreviewComponent)).length).toBe(1);
	});
});
