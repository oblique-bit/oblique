import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';

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

describe('TextControlClear', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() =>
		TestBed.configureTestingModule({
			declarations: [TestComponent, MockTranslatePipe],
			imports: [FormsModule]
		}).compileComponents()));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
