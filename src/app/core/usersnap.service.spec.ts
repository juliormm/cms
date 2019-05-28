import { TestBed, inject } from '@angular/core/testing';

import { UsersnapService } from './usersnap.service';

describe('UsersnapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersnapService]
    });
  });

  it('should be created', inject([UsersnapService], (service: UsersnapService) => {
    expect(service).toBeTruthy();
  }));
});
