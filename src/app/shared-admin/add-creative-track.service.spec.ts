import { TestBed, inject } from '@angular/core/testing';

import { AddCreativeTrackService } from './add-creative-track.service';

describe('AddCreativeTrackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddCreativeTrackService]
    });
  });

  it('should be created', inject([AddCreativeTrackService], (service: AddCreativeTrackService) => {
    expect(service).toBeTruthy();
  }));
});
