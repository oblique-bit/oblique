import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Component, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {FilterBoxComponent} from './filter-box.component';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}

@Component({
	template: `
		TODO
	`
})
class TestComponent {
}

describe('FilterBox', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() =>
		TestBed.configureTestingModule({
			declarations: [TestComponent, FilterBoxComponent, MockTranslatePipe],
			imports: [FormsModule]
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
});
