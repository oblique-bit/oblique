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

	it('should have an .input-group-prepend before .control-action', () => {
		expect(fixture.debugElement.queryAll(
			By.css('.input-group-prepend + .control-action')
		).length).toBe(1);
	});

	it('should have an .input-group-append after .control-action', () => {
		expect(fixture.debugElement.queryAll(
			By.css('.control-action + .input-group-append')
		).length).toBe(1);
	});
});
