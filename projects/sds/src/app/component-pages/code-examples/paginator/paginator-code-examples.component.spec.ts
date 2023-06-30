import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {HighlightedCodeComponent} from '../../code-example/highlighted-code/highlighted-code.component';
import {TabComponent} from '../../tabs/tab/tab.component';
import {TabsComponent} from '../../tabs//tabs.component';
import {IdModule} from '../../../shared/id/id.module';
import {PaginatorCodeExamplesComponent} from './paginator-code-examples.component';
import {MatPaginatorModule} from '@angular/material/paginator';

describe(`${PaginatorCodeExamplesComponent.name}`, () => {
	let fixture: ComponentFixture<PaginatorCodeExamplesComponent>;
	let component: PaginatorCodeExamplesComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PaginatorCodeExamplesComponent, CodeExampleComponent, HighlightedCodeComponent, TabsComponent, TabComponent],
			imports: [IdModule, MatPaginatorModule]
		}).compileComponents();

		fixture = TestBed.createComponent(PaginatorCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('create', () => {
		expect(component).toBeTruthy();
	});
});
