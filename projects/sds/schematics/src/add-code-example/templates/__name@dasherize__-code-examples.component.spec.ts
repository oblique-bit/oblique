import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {<%=classifiedName%>CodeExamplesComponent} from './<%= dasherizedName %>-code-examples.component';

describe(<%=classifiedName%>CodeExamplesComponent.name, () => {
	let component: <%=classifiedName%>CodeExamplesComponent;
	let fixture: ComponentFixture<<%=classifiedName%>CodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [<%=classifiedName%>CodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(<%=classifiedName%>CodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
