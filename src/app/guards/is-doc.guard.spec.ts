import { TestBed, async, inject } from '@angular/core/testing';

import { IsDocGuard } from './is-doc.guard';

describe('IsDocGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsDocGuard]
    });
  });

  it('should ...', inject([IsDocGuard], (guard: IsDocGuard) => {
    expect(guard).toBeTruthy();
  }));
});
