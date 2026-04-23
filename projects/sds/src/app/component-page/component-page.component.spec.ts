import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {ComponentPageComponent} from './component-page.component';

describe(ComponentPageComponent.name, () => {
	let component: ComponentPageComponent;
	let fixture: ComponentFixture<ComponentPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterModule, ComponentPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ComponentPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
