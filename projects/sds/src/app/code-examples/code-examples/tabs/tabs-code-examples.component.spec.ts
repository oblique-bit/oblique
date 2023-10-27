import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TabsCodeExamplesComponent} from './tabs-code-examples.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {ObIconModule} from '@oblique/oblique';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

describe(TabsCodeExamplesComponent.name, () => {
	let component: TabsCodeExamplesComponent;
	let fixture: ComponentFixture<TabsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				TabsCodeExamplesComponent,
				CommonModule,
				IdPipe,
				CodeExampleComponent,
				MatTabsModule,
				MatIconModule,
				ObIconModule,
				NoopAnimationsModule
			]
		}).compileComponents();

		fixture = TestBed.createComponent(TabsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have 2 CodeExampleComponent', () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});
});
