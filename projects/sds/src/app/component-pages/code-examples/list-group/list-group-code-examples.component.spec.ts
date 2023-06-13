import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {IdModule} from '../../../shared/id/id.module';
import {ListGroupCodeExamplesComponent} from './list-group-code-examples.component';
import {ListGroupExampleDefaultComponent} from './previews/list-group-example-default/list-group-example-default.component';
import {ListGroupExampleCheckBoxComponent} from './previews/list-group-example-checkbox/list-group-example-checkbox.component';
import {ListGroupExampleIconComponent} from './previews/list-group-example-icon/list-group-example-icon.component';
import {ListGroupExampleIconCheckboxComponent} from './previews/list-group-example-icon-checkbox/list-group-example-icon-checkbox.component';

describe(ListGroupCodeExamplesComponent.name, () => {
	let component: ListGroupCodeExamplesComponent;
	let fixture: ComponentFixture<ListGroupCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ListGroupCodeExamplesComponent],
			imports: [
				IdModule,
				MatButtonModule,
				ObButtonModule,
				ListGroupExampleDefaultComponent,
				ListGroupExampleCheckBoxComponent,
				ListGroupExampleIconComponent,
				ListGroupExampleIconCheckboxComponent
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
