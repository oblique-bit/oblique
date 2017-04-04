import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectSampleComponent } from './multiselect-sample.component';

describe('MultiselectSampleComponent', () => {
  let component: MultiselectSampleComponent;
  let fixture: ComponentFixture<MultiselectSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
