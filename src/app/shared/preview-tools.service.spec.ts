import { TestBed, inject } from '@angular/core/testing';

import { PreviewToolsService } from './preview-tools.service';

describe('PreviewToolsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviewToolsService]
    });
  });

  it('should be created', inject([PreviewToolsService], (service: PreviewToolsService) => {
    expect(service).toBeTruthy();
  }));
});
