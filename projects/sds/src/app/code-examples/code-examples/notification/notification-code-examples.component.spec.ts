import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NotificationCodeExamplesComponent} from './notification-code-examples.component';
import {NotificationExampleDefaultPreviewComponent} from './previews/default/notification-example-default-preview.component';
import {NotificationExampleOtherOptionsPreviewComponent} from './previews/other-options/notification-example-other-options-preview.component';

describe(NotificationCodeExamplesComponent.name, () => {
	let component: NotificationCodeExamplesComponent;
	let fixture: ComponentFixture<NotificationCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NotificationCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NotificationCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${NotificationExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NotificationExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NotificationExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NotificationExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});
});
