import { TestBed, inject } from '@angular/core/testing';

import { CampaignDataService } from './campaign-data.service';

describe('CampaignDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignDataService]
    });
  });

  it('should be created', inject([CampaignDataService], (service: CampaignDataService) => {
    expect(service).toBeTruthy();
  }));
});
