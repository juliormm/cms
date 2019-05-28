/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductionSharedService } from './production-shared.service';

describe('ProductionSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionSharedService]
    });
  });

  it('should ...', inject([ProductionSharedService], (service: ProductionSharedService) => {
    expect(service).toBeTruthy();
  }));
});
