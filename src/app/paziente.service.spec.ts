import { TestBed } from '@angular/core/testing';
import { PazienteService } from './services/pazienteService.service';


describe('PazienteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PazienteService = TestBed.get(PazienteService);
    expect(service).toBeTruthy();
  });
});
