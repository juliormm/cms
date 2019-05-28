import { TestBed, inject } from '@angular/core/testing';

import { DuplicateCreativesService } from './duplicate-creatives.service';

describe('DuplicateCreativesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DuplicateCreativesService]
    });
  });

  it('should ...', inject([DuplicateCreativesService], (service: DuplicateCreativesService) => {
    expect(service).toBeTruthy();
  }));
});
