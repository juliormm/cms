import { TestBed, inject } from '@angular/core/testing';

import { DynamicModalService } from './dynamic-modal.service';

describe('DynamicModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicModalService]
    });
  });

  it('should be created', inject([DynamicModalService], (service: DynamicModalService) => {
    expect(service).toBeTruthy();
  }));
});
