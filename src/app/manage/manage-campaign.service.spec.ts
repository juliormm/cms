import { TestBed, inject } from '@angular/core/testing';

import { ManageCampaignService } from './manage-campaign.service';

describe('ManageCampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageCampaignService]
    });
  });

  it('should be created', inject([ManageCampaignService], (service: ManageCampaignService) => {
    expect(service).toBeTruthy();
  }));
});
