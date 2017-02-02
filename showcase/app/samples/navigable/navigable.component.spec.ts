/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { NavigableComponent } from './navigable.component';
import {MockTranslatePipe} from '../../../../src/testhelpers/mock-translate.pipe';
import {NavigableModule} from '../../../../src/navigable/navigable.module';

describe('NavigableComponent', () => {
  let component: NavigableComponent;
  let fixture: ComponentFixture<NavigableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigableComponent, MockTranslatePipe ],
      imports: [NavigableModule],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
