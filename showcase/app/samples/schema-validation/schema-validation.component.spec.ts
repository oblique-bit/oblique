/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaValidationComponent } from './schema-validation.component';
import {MockTranslatePipe} from '../../../../src/testhelpers/mock-translate.pipe';
import {SchemaValidationModule} from '../../../../src/schema-validation/schema-validation.module';
import {FormsModule} from '@angular/forms';

describe('SchemaValidationComponent', () => {
  let component: SchemaValidationComponent;
  let fixture: ComponentFixture<SchemaValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SchemaValidationModule, FormsModule],
      declarations: [ SchemaValidationComponent, MockTranslatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
