import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailPage } from './patient-detail.page';

describe('PatientDetailPage', () => {
  let component: PatientDetailPage;
  let fixture: ComponentFixture<PatientDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
