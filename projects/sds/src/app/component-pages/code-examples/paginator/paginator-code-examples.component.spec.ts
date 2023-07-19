import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {HighlightedCodeComponent} from '../../code-example/highlighted-code/highlighted-code.component';
import {TabComponent} from '../../tabs/tab/tab.component';
import {TabsComponent} from '../../tabs//tabs.component';
import {PaginatorCodeExamplesComponent} from './paginator-code-examples.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {IdPipe} from '../../../shared/id/id.pipe';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(`${PaginatorCodeExamplesComponent.name}`, () => {
	let fixture: ComponentFixture<PaginatorCodeExamplesComponent>;
	let component: PaginatorCodeExamplesComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				IdPipe,
				MatPaginatorModule,
				PaginatorCodeExamplesComponent,
				CodeExampleComponent,
				HighlightedCodeComponent,
				TabsComponent,
				TabComponent,
				NoopAnimationsModule
			]
		}).compileComponents();

		fixture = TestBed.createComponent(PaginatorCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('create', () => {
		expect(component).toBeTruthy();
	});
});
