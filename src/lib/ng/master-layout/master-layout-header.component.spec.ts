import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLayoutHeaderComponent } from './master-layout-header.component';

describe('MasterLayoutHeaderComponent', () => {
  let component: MasterLayoutHeaderComponent;
  let fixture: ComponentFixture<MasterLayoutHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterLayoutHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterLayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
