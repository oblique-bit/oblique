import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IdModule} from '../shared/id/id.module';
import {ComponentPagesComponent} from './component-pages.component';
import {TabComponent} from './tabs/tab/tab.component';
import {TabsComponent} from './tabs/tabs.component';

describe('ComponentPagesComponent', () => {
	let component: ComponentPagesComponent;
	let fixture: ComponentFixture<ComponentPagesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ComponentPagesComponent, TabsComponent, TabComponent],
			imports: [HttpClientTestingModule, IdModule, RouterTestingModule]
		}).compileComponents();

		fixture = TestBed.createComponent(ComponentPagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
