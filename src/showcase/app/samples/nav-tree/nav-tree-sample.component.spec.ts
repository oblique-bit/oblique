import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NgbButtonsModule, NgbCollapseModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {NavTreeComponent} from '../../../../lib';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {NavTreeSampleComponent} from './nav-tree-sample.component';
import 'rxjs/add/observable/of';

describe('NavTreeSampleComponent', () => {
	let component: NavTreeSampleComponent;
	let fixture: ComponentFixture<NavTreeSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockTranslatePipe,
				NavTreeSampleComponent,
				NavTreeComponent
			],
			imports: [
				CommonModule,
				FormsModule,
				RouterTestingModule,
				NgbCollapseModule,
				NgbButtonsModule,
				NgbTooltipModule.forRoot()
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		}).compileComponents();
	}));

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = Observable.of({sample: {navTree: {items: []}}});
		fixture = TestBed.createComponent(NavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
