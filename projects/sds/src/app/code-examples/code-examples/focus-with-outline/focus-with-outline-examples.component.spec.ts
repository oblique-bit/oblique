import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FocusWithOutlineExamplesComponent} from './focus-with-outline-examples.component';
import {provideNativeDateAdapter} from '@angular/material/core';

describe(FocusWithOutlineExamplesComponent.name, () => {
	let component: FocusWithOutlineExamplesComponent;
	let fixture: ComponentFixture<FocusWithOutlineExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FocusWithOutlineExamplesComponent, NoopAnimationsModule, TranslateModule.forRoot()],
			providers: [provideNativeDateAdapter()]
		}).compileComponents();

		fixture = TestBed.createComponent(FocusWithOutlineExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`should have 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});
});
