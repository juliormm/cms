import { TestBed, inject } from '@angular/core/testing';

import { CreativeTypesService } from './creative-types.service';

describe('CreativeTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreativeTypesService]
    });
  });

  it('should ...', inject([CreativeTypesService], (service: CreativeTypesService) => {
    expect(service).toBeTruthy();
  }));
});
