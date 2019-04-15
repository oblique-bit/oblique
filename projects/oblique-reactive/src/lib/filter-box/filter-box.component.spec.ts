import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs/internal/observable/of';
import {FilterBoxComponent, MaterialService, TextControlClearModule} from 'oblique-reactive';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}

@Component({
	template: `
		<or-filter-box pattern="test">
			<ng-template #prepend><i class="fa fa-search"></i></ng-template>
			<ng-template #append><i class="fa fa-search"></i></ng-template>
		</or-filter-box>
	`
})
class TestComponent {
}

describe('FilterBox', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
			const materialMock = {
				toggled: of(false)
			};
			TestBed.configureTestingModule({
				imports: [FormsModule, TextControlClearModule],
				declarations: [
					TestComponent,
					FilterBoxComponent,
					MockTranslatePipe
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [{provide: MaterialService, useValue: materialMock}]
			}).compileComponents();
		}
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
		const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
		expect(elements[0].nativeElement.parentElement.classList.contains('input-group-prepend')).toBe(true);
	});

	it('should have an `.input-group-append` content projected', () => {
		const elements = fixture.debugElement.queryAll(By.css('.input-group .input-group-text'));
		expect(elements.pop().nativeElement.parentElement.classList.contains('input-group-append')).toBe(true);
	});
});
