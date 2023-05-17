import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DocumentationPagesComponent} from './documentation-pages.component';
import {IdModule} from '../shared/id/id.module';

describe('DocumentationPagesComponent', () => {
	let component: DocumentationPagesComponent;
	let fixture: ComponentFixture<DocumentationPagesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DocumentationPagesComponent],
			imports: [HttpClientTestingModule, IdModule, RouterTestingModule]
		}).compileComponents();

		fixture = TestBed.createComponent(DocumentationPagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
