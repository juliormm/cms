/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductionListService } from './production-list.service';

describe('ProductionListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionListService]
    });
  });

  it('should ...', inject([ProductionListService], (service: ProductionListService) => {
    expect(service).toBeTruthy();
  }));
});
