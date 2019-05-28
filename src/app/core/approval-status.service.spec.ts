/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApprovalStatusService } from './approval-status.service';

describe('ApprovalStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovalStatusService]
    });
  });

  it('should ...', inject([ApprovalStatusService], (service: ApprovalStatusService) => {
    expect(service).toBeTruthy();
  }));
});
