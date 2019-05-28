import { TestBed, inject } from '@angular/core/testing';

import { NotificationTrackerService } from './notification-tracker.service';

describe('NotificationTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationTrackerService]
    });
  });

  it('should be created', inject([NotificationTrackerService], (service: NotificationTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
