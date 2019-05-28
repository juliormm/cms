/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApprovalSharedService } from './approval-shared.service';

describe('ApprovalSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovalSharedService]
    });
  });

  it('should ...', inject([ApprovalSharedService], (service: ApprovalSharedService) => {
    expect(service).toBeTruthy();
  }));
});
