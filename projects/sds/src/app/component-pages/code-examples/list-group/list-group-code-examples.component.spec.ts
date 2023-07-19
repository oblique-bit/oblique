import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {ListGroupCodeExamplesComponent} from './list-group-code-examples.component';
import {ListGroupExampleDefaultComponent} from './previews/list-group-example-default/list-group-example-default.component';
import {ListGroupExampleCheckBoxComponent} from './previews/list-group-example-checkbox/list-group-example-checkbox.component';
import {ListGroupExampleIconComponent} from './previews/list-group-example-icon/list-group-example-icon.component';
import {ListGroupExampleIconCheckboxComponent} from './previews/list-group-example-icon-checkbox/list-group-example-icon-checkbox.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

describe(ListGroupCodeExamplesComponent.name, () => {
	let component: ListGroupCodeExamplesComponent;
	let fixture: ComponentFixture<ListGroupCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				IdPipe,
				MatButtonModule,
				ObButtonModule,
				ListGroupExampleDefaultComponent,
				ListGroupExampleCheckBoxComponent,
				ListGroupExampleIconComponent,
				ListGroupExampleIconCheckboxComponent,
				ListGroupCodeExamplesComponent,
				CommonModule
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ListGroupCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
