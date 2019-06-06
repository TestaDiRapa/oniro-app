import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbitudiniComponent } from './add-abitudini.component';

describe('AddAbitudiniComponent', () => {
  let component: AddAbitudiniComponent;
  let fixture: ComponentFixture<AddAbitudiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAbitudiniComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbitudiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
