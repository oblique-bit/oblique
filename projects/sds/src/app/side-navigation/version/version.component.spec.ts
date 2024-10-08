import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {IdPipe} from '../../shared/id/id.pipe';
import {VersionComponent} from './version.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

describe(VersionComponent.name, () => {
	let component: VersionComponent;
	let fixture: ComponentFixture<VersionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, ReactiveFormsModule, IdPipe, VersionComponent, NoopAnimationsModule],
			providers: [provideRouter([])]
		}).compileComponents();

		fixture = TestBed.createComponent(VersionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
