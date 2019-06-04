import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDevicePage } from './select-device.page';

describe('SelectDevicePage', () => {
  let component: SelectDevicePage;
  let fixture: ComponentFixture<SelectDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDevicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
