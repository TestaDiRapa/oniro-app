import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestePazientiPage } from './richieste-pazienti.page';

describe('RichiestePazientiPage', () => {
  let component: RichiestePazientiPage;
  let fixture: ComponentFixture<RichiestePazientiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestePazientiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestePazientiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
