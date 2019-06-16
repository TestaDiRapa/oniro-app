import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendModalPage } from './send-modal.page';

describe('SendModalPage', () => {
  let component: SendModalPage;
  let fixture: ComponentFixture<SendModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
