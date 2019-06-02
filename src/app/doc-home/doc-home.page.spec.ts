import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocHomePage } from './doc-home.page';

describe('DocHomePage', () => {
  let component: DocHomePage;
  let fixture: ComponentFixture<DocHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
