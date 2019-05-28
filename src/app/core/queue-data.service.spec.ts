import { TestBed, inject } from '@angular/core/testing';

import { QueueDataService } from './queue-data.service';

describe('QueueDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueueDataService]
    });
  });

  it('should be created', inject([QueueDataService], (service: QueueDataService) => {
    expect(service).toBeTruthy();
  }));
});
