import { TestBed, inject } from '@angular/core/testing';

import { AppManageService } from './app-manage.service';

describe('AppManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppManageService]
    });
  });

  it('should be created', inject([AppManageService], (service: AppManageService) => {
    expect(service).toBeTruthy();
  }));
});
