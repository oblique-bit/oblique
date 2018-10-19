import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {FilterBoxComponent} from 'oblique-reactive';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}

@Component({
	template: `
		<or-filter-box pattern="test">
			<span class="input-group-prepend"><i class="fa fa-search"></i></span>
			<span class="input-group-append"><i class="fa fa-search"></i></span>
		</or-filter-box>
	`
})
class TestComponent {
}

describe('FilterBox', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() =>
		TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [
				TestComponent,
				FilterBoxComponent,
				MockTranslatePipe
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents()
	));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should have an `.input-group-prepend` content projected', () => {
		expect(fixture.debugElement.queryAll(
			By.css('.input-group .input-group-prepend')
		).length).toBe(1);
	});

	it('should have an `.input-group-append` content projected', () => {
		expect(fixture.debugElement.queryAll(
			By.css('.input-group .input-group-append')
		).length).toBe(1);
	});
});
