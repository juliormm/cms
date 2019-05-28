/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AmSharedService } from './am-shared.service';

describe('AmSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmSharedService]
    });
  });

  it('should ...', inject([AmSharedService], (service: AmSharedService) => {
    expect(service).toBeTruthy();
  }));
});
