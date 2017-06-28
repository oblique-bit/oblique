import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Component, Pipe, PipeTransform} from '@angular/core';
import {FilterBoxComponent} from './filter-box.component';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}

@Component({
	template: `
		<or-filter-box pattern="test">
			<span class="input-group-addon" filter-box-before><i class="fa fa-search"></i></span>
			<span class="input-group-addon" filter-box-after><i class="fa fa-search"></i></span>
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

	it('should have an .input-group-addon before and after .control-action', () => {
		expect(fixture.debugElement.queryAll(
			By.css('.input-group-addon + .control-action, .control-action + .input-group-addon')
		).length).toBe(2);
	});
});
