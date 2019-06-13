import { TestBed } from '@angular/core/testing';

import { GetCoordService } from '../../services/get-coord.service';

describe('GetCoordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetCoordService = TestBed.get(GetCoordService);
    expect(service).toBeTruthy();
  });
});
