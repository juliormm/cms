/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageResolverService } from './manage-resolver';

describe('ManageResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageResolverService]
    });
  });

  it('should ...', inject([ManageResolverService], (service: ManageResolverService) => {
    expect(service).toBeTruthy();
  }));
});
