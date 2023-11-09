import {ComponentFixture, TestBed, inject, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {of} from 'rxjs';
import {ObliqueTestingModule} from '@oblique/oblique';
import {NavTreeSampleComponent} from './nav-tree-sample.component';

describe('ObNavTreeSampleComponent', () => {
	let component: NavTreeSampleComponent;
	let fixture: ComponentFixture<NavTreeSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [NavTreeSampleComponent],
			imports: [CommonModule, FormsModule, RouterTestingModule, ObliqueTestingModule, MatRadioModule, MatCheckboxModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = of({sample: {navTree: {items: []}}});
		fixture = TestBed.createComponent(NavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
