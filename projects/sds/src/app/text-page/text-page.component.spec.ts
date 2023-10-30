import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TextPageComponent} from './text-page.component';
import {IdPipe} from '../shared/id/id.pipe';

describe(TextPageComponent.name, () => {
	let component: TextPageComponent;
	let fixture: ComponentFixture<TextPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, IdPipe, RouterTestingModule, TextPageComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TextPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
