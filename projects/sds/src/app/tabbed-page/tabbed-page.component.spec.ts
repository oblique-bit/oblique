import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TabbedPageComponent} from './tabbed-page.component';
import {TabComponent} from '../shared/tabs/tab/tab.component';
import {TabsComponent} from '../shared/tabs/tabs.component';
import {IdPipe} from '../shared/id/id.pipe';

describe(TabbedPageComponent.name, () => {
	let component: TabbedPageComponent;
	let fixture: ComponentFixture<TabbedPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, IdPipe, RouterTestingModule, TabbedPageComponent, TabsComponent, TabComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TabbedPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
