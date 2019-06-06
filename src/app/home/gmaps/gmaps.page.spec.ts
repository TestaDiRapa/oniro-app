import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapsPage } from './gmaps.page';

describe('GmapsPage', () => {
  let component: GmapsPage;
  let fixture: ComponentFixture<GmapsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmapsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
